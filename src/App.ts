import {ipcMain, dialog, WebContents} from 'electron';
import * as net from 'net';
import * as fs from 'fs';

export class App {
    private _server: net.Server;
    private _web: WebContents;
    private _file_loaded_path: string;

    constructor(web: WebContents) 
    {
        this._web = web;

        ipcMain.on('get-file', () => 
        {
            dialog.showOpenDialog({
                properties: ['openFile']
            }).then((result) =>
            {
                if (result.canceled) {
                    this._web.send('disable-sender-button');
                    return;
                }

                this._web.send('enable-sender-button');
                this._file_loaded_path = result.filePaths[0];
            });
        });

        ipcMain.on('send-file', () =>
        {
            // send file
        });
    }

    listen() {
        this._server = net.createServer((socket) =>
        {
            
        });
    }
}