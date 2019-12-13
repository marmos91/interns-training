import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';

export interface FileData
{
    file: string;
    name: string;
    type: string;
    size: number;
}

export class App
{
    private _server: net.Server;
    private _downloads_path: string;

    constructor(download_path: string)
    {
        this._server = net.createServer();
        this._downloads_path = download_path;
    }

    /**
     * Start the server and register event handlers.
     * @param callback a callback function that is called when server has started
     */
    public listen(callback: (port: number) => void)
    {

        this._server.on('error', (err) =>
        {
            throw new Error('Server error ' + err.message);
        });

        this._server.on('connection', this._connectionHandler.bind(this));

        // start server on random port number
        this._server.listen(() =>
        {
            callback(this._server.address().port);
        });
    }

    /**
     * Handle connection events such incoming data to be saved.
     * @param socket the connected socket
     */
    private _connectionHandler(socket: net.Socket)
    {
        let data_buffer: Buffer;
        socket.on('error', (err) =>
        {
            throw new Error('Socket error ' + err.message);
        });

        socket.on('close', () =>
        {
            // handle closing socket
        });

        socket.on('data', (data: Buffer) =>
        {
            if (!data_buffer)
                data_buffer = data;
            else
                data_buffer = Buffer.concat([data_buffer, data]);
        });

        socket.on('end', () =>
        {
            const file_object: FileData = JSON.parse(data_buffer.toString());
            this._writeFile(this._downloads_path, file_object.name, file_object.file);
        });
    }

    /**
     * Save a file to disk.
     * @param name name of the file
     * @param path the path where the file will be saved
     * @param buffer the actual file as a buffer
     */
    private _writeFile(file_path: string, name: string, buffer: string)
    {
        fs.writeFile(path.join(file_path, name), buffer, (err) =>
        {
            if (err)
                throw new Error('error writing file ' + err.message);
        });
    }
}