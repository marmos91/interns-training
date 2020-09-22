import {ipcMain, dialog, WebContents} from 'electron';
import * as net from 'net';
import * as fs from 'fs';

interface IClient
{
    ip: string;
    port: number;
}

export class App 
{
    private _server: net.Server;
    private _web: WebContents;
    private _chosen_file_path: string;

    constructor(web: WebContents) 
    {
        this._web = web;

        ipcMain.on('get-file', () => 
        {
            dialog.showOpenDialog({
                properties: ['openFile']
            }).then((result) =>
            {
                if(result.canceled) 
                {
                    this._web.send('disable-sender-button');
                    return;
                }

                this._chosen_file_path = result.filePaths[0];
                this._web.send('enable-sender-button');
                this._web.send('set-filepath', this._chosen_file_path);
            }).catch(_ => 
            {
                this._web.send('disable-sender-button');
            });
        });

        ipcMain.on('send-file', (event, client: IClient) =>
        {
            this._check_connection(client).then((socket) => 
            {
                socket.on('error', () =>
                {
                    this._web.send('transfer-failed');
                });

                fs.readFile(this._chosen_file_path, (error, data) =>
                {
                    if (error) 
                    {
                        dialog.showMessageBox({
                            type: 'error',
                            message: 'Error reading the file, choose another one'
                        });

                        this._web.send('transfer-failed');
                        return;
                    }

                    socket.write(data);
                    socket.pipe(socket);
                    socket.end();
                    socket.destroy();

                    this._web.send('transfer-completed');
                });
            }).catch(() =>
            {
                dialog.showMessageBox({
                    type: 'error',
                    message: 'Please insert a valid destination address'
                });

                this._web.send('transfer-failed');
            });
        });

        this._web.on('did-finish-load', () =>
        {
            const port = this._server.address().port;
            this._web.send('set-port', port);
        });
    }

    public listen(): void
    {
        this._server = net.createServer((socket) =>
        {
            const file_chunks: Buffer[] = [];

            socket.on('data', (data) =>
            {
                file_chunks.push(data);
            });

            socket.on('end', () =>
            {
                this._web.send('transfer-received');
            });
        });

        this._server.listen();
    }

    private _check_connection(client: IClient): Promise<net.Socket>
    {
        return new Promise((resolve, reject) =>
        {
            let socket: net.Socket;
            
            const timeout = setTimeout(() =>
            {
                reject();
                socket.end();
            }, 1000);

            socket = net.createConnection({port: client.port, host: client.ip}, () => 
            {
                clearTimeout(timeout);
                resolve(socket);
            });

            socket.on('error', () =>
            {
                clearTimeout(timeout);
                reject();
            });
        });
    }
} 