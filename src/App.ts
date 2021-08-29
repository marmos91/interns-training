import {app, BrowserWindow, ipcMain, dialog} from 'electron';
import * as url from 'url';
import * as path from 'path';
import * as net from 'net';
import {SEND_FILE, SELECT_FILE, SET_FILE_PATH, START_SERVER, SET_SERVER_PORT} from './events';

export class App
{
    private _overseer: number = 0;
    private _file_path: string;
    private _port: number;

    public listen()
    {
        console.log("XD")
        // Wait until the app is ready
        app.whenReady().then(() => {
            const win = new BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
            
            win.loadFile('../resources/index.html');
        
            win.webContents.openDevTools();

        })

        ipcMain.on('main:increment-count', (event, payload) => {
            console.log('main:increment-count')
            this._overseer += 1
        })

        ipcMain.on('main:decrement-count', (event, payload) => {
            console.log('main:decrement-count')
            this._overseer -= 1
        })
        
        ipcMain.on('main:request-count', (event, payload) => {
            console.log('main:request-count')
            event.reply('preload:set-count', this._overseer)
        })

        ipcMain.on(START_SERVER, (event, payload) => 
        {
            console.log('app: start_server');
            this._prepare_tcp_server(event);
        });

        ipcMain.on(SELECT_FILE, async (event, payload) => 
        {
            console.log('app:select file', payload);

            const dialog_response = await dialog.showOpenDialog({properties: ['openFile']});
            console.log('app: select file dialog_response: ', dialog_response);
            if(!dialog_response.canceled)
            {
                this._file_path = dialog_response.filePaths[0];
                console.log('app: selected file: ', this._file_path);
            }
        });

        ipcMain.on(SEND_FILE, async (event, payload) => 
        {
            console.log('app:send file', payload);
            // dialog.showOpenDialog({properties: ['openFile', 'multiSelections']});
            // console.log(await dialog.showOpenDialog({properties: ['openFile']}));
            const {ip, port} = payload;
            if(!ip || !port)
                console.log(await dialog.showMessageBox({title: 'Notification', message: 'IP and PORT are required'}));
            // event.reply('preload:set-count', this._overseer)
        });
    }

    private _prepare_tcp_server(event: Electron.IpcMainEvent)
    {
        const server = net.createServer();
        server.listen(0, () => 
        {
            this._port = (server.address() as net.AddressInfo).port;

            console.log('app: server listening on: ', this._port);
            event.reply(SET_SERVER_PORT, this._port);
        });
        server.on('connection', async (socket) => 
        {
            console.log(`new connection from ${socket.remoteAddress}:${socket.remotePort}`);
        });        
    }
}