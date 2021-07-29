import net from "net";
import { constants, createReadStream, createWriteStream, WriteStream } from "fs";
import { access, lstat } from "fs/promises";
import { basename, join } from "path";
import sanitize from "sanitize-filename";
import { dialog, ipcMain, IpcMainEvent } from "electron";
import mkdirp from 'mkdirp';
import nanoid from 'nanoid';

import { ElectronStarter } from "./ElectronStarter";
import { dialog_closed_event, open_dialog_command, send_file_command, send_file_failed_event, send_file_succeeded_event, server_bound_event, start_server_command } from "./shared/events_commands";

/**
 * Metadata exchange protocol:
 * 
 * Legend:
 * - boundary: random identifier
 * - filename: metadata
 * 
 * Server                   Client
 * ----------------------------------------
 *                          <- CONNECT
 * (1) send boundary ->
 *                          -> (2) receive boundary
 *                          <- (3) SEND FILENAME
 *                          <- (4) send boundary    <=====   Can send other metadatas here
 * (5) RECEIVE FILENAME <-
 * (6) receive boundary <-
 * (7) send boundary ->
 *                          -> (8) receive boundary
 *                          <- (9) SEND FILE (bin)
 * (10) RECEIVE FILE (bin) <-
 */
export class App
{
    private _download_folder = join(process.cwd(), 'downloads');

    constructor(private _electron: ElectronStarter)
    {}

    public async listen()
    {
        ipcMain.on(start_server_command, this._on_start_server_command.bind(this));
        ipcMain.on(open_dialog_command, this._on_open_dialog_command.bind(this));
        ipcMain.on(send_file_command, this._on_send_file_command.bind(this));

        await this._try_make_download_folder(this._download_folder);
    }

    private _on_start_server_command(event: IpcMainEvent)
    {
        const server = net.createServer(async connectionListener =>
        {
            let received_filename = false;
            let write_stream: WriteStream;
            let boundary = `|>${nanoid.nanoid()}<|`;

            let filename_buffer = '';

            // (1) Tell the client which is the boundary
            connectionListener.write(boundary);

            connectionListener.on('end', () =>
            {
                received_filename = false;
                write_stream?.close();
            });

            connectionListener.on('data', async data =>
            {
                if (!received_filename)
                {
                    filename_buffer += data;

                    if (filename_buffer.endsWith(boundary))
                    {
                        // (5)-(6) Received the filename + boundary
                        received_filename = true;

                        const raw_filename = filename_buffer.replace(boundary, '');
                        const filename = await this._filter_filename(raw_filename);

                        console.log(`Saving file ${filename} into folder ${this._download_folder}`);

                        write_stream = createWriteStream(join(this._download_folder, filename));

                        // (7) Send back the boundary, for the client to know that the server is ready to accept binary data
                        connectionListener.write(boundary);
                    }                    
                }
                else
                {
                    // (10) Receive the binary data
                    write_stream.write(data);
                }
            });
        });

        server.on('error', err =>
        {
            throw err;
        });

        server.listen(0, () =>
        {
            const port = (server.address() as net.AddressInfo).port;

            console.log(`Server listening on port ${port}`);

            event.reply(server_bound_event, port);
        });
    }

    private _on_open_dialog_command(event: IpcMainEvent)
    {
        console.log('Received open-dialog command');

        dialog.showOpenDialog({})
            .then(result =>
            {
                event.reply(dialog_closed_event, result);
            });
    }

    private async _on_send_file_command(event: IpcMainEvent, file: string, address: string, port: number)
    {
        console.log(`Send ${file} to ${address}:${port}`);

        // Check if the file can be read
        const file_can_be_read = await this._file_can_be_read(file);

        if (!file_can_be_read)
        {
            console.error(`File cannot be read.`);
            return this._file_send_failure(event, new Error(`File cannot be read`));
        }

        // Create the file read stream
        const file_name = basename(file);

        const read_stream = createReadStream(file);
        
        let file_sent = false;

        // Create the socket for transmission

        const socket = new net.Socket();

        socket.connect(port, address);
        
        let boundary_received = false;
        let boundary = '';
        let filename_acknowledged_buffer = '';

        socket.on('data', data =>
        {
            if (!boundary_received)
            {
                boundary += data.toString();

                if (boundary.endsWith('<|'))
                {
                    // (2) Boundary received
                    boundary_received = true;

                    // (3)-(4) Send filename + boundary to server
                    socket.write(`${file_name}${boundary}`);
                }
            }
            else
            {
                filename_acknowledged_buffer += data.toString();

                if (filename_acknowledged_buffer.endsWith(boundary))
                {
                    // (8) The server acknowledged the filename
                    // (9) Send the file
                    read_stream.on('end', () =>
                    {
                        read_stream.close();

                        socket.end(() =>
                        {
                            socket.destroy();

                            file_sent = true;

                            this._file_send_success(event);
                        });
                    });

                    read_stream.pipe(socket);
                }
            }
        });

        socket.on('error', err =>
        {
            socket.destroy();

            if (!file_sent)
                this._file_send_failure(event, err);
        });
    }

    private _file_send_failure(event: IpcMainEvent, reason: Error)
    {
        event.reply(send_file_failed_event, reason);
    }

    private _file_send_success(event: IpcMainEvent)
    {
        event.reply(send_file_succeeded_event);
    }

    private async _file_can_be_read(file: string): Promise<boolean>
    {
        try
        {
            await access(file, constants.R_OK);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private async _path_exists(path: string): Promise<boolean>
    {
        try
        {
            await access(path);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private async _path_is_directory(path: string): Promise<boolean>
    {
        const stat = await lstat(path);
        if (stat.isDirectory())
        {
            return true;
        }
    }

    private async _try_make_download_folder(path: string)
    {
        if (!await this._path_exists(path))
        {
            return await mkdirp(path);
        }
        else if (!this._path_is_directory)
        {
            throw new Error(`Cannot create directory ${path}.`);
        }
    }

    private async _filter_filename(raw_filename: string): Promise<string>
    {
        let filename = sanitize(raw_filename);

        if (!await this._path_exists(join(this._download_folder, filename)))
            return filename;

        const id = nanoid.nanoid();
        
        const [_, name, __, ext] = filename.match(/^(.*?)(\.(((?!\.).)*))?$/i);

        return `${name}.${id}.${ext}`;
    }
}