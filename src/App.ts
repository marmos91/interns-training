import {app, BrowserWindow, ipcMain, dialog} from 'electron';
import * as path from 'path';
import * as net from 'net';
import * as fs from 'fs';
import {SEND_FILE, SELECT_FILE, SET_FILE_PATH, START_SERVER, SET_SERVER_PORT, FILE_TRANSFER_UPDATE} from './events';


export class App
{
    private _file_path: string;
    private _server: net.Server;
    private _port: number;

    public listen()
    {
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
        });

        ipcMain.on(START_SERVER, (event, payload) => 
        {
            this._prepare_tcp_server(event);
        });

        ipcMain.on(SELECT_FILE, async (event, payload) => 
        {
            const dialog_response = await dialog.showOpenDialog({properties: ['openFile']});

            if(!dialog_response.canceled)
                this._file_path = dialog_response.filePaths[0];
    
        });

        ipcMain.on(SEND_FILE, (event, payload) => 
        {
            const {ip, port} = payload;

            if(!ip || !port || !this._file_path)
            {
                dialog.showMessageBox({title: 'Notification', message: 'IP, PORT and file are required'});
                return;
            }
            
            event.reply(FILE_TRANSFER_UPDATE, 'File transfer in progress.');

            const client = net.createConnection({host: ip, port:port});
            
            const read_stream_file = fs.createReadStream(this._file_path);

            read_stream_file.pipe(client);

            read_stream_file.on('end', () => 
            {
                read_stream_file.close();

                client.destroy();

                event.reply(FILE_TRANSFER_UPDATE, 'Transfer completed!');
            });

            client.on('end', () => 
            {
                console.log('Client socket disconnected.');
            });

            client.on('error', (error) =>
            {
                console.error(error);
            });
        });
    }
    
    private _prepare_tcp_server(event: Electron.IpcMainEvent)
    {
        this._server = net.createServer((socket) => 
        {
            const write_stream = fs.createWriteStream(path.join(__dirname, '../downloaded'));

            socket.on('data', (data) => 
            {   
                event.reply(FILE_TRANSFER_UPDATE, 'Transfer in progress.');
                write_stream.write(data);
            });

            socket.on('end', () =>
            {
                write_stream.close();
                event.reply(FILE_TRANSFER_UPDATE, 'Transfer received!');
            });
        });
       
        this._server.on('connection', async (socket) => 
        {
            console.log(`New connection from ${socket.remoteAddress}:${socket.remotePort}`);
        });  
          
        this._server.on('close', () => 
        {
            console.log('TCP server socket is closed.');
        });

        this._server.on('error', (error) =>
        {
            console.error(error);
        }); 

        this._server.listen(0, () => 
        {
            this._port = (this._server.address() as net.AddressInfo).port;
            console.log('App: server listening on: ', this._port);

            event.reply(SET_SERVER_PORT, this._port);
        });
    }
}