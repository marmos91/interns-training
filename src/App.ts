import * as net from 'net';
const electron = require('electron');
const path = require('path');
const url = require('url');

export class App
{
    public server: net.Server;

    public listen()
    {
        this.server = net.createServer();
        electron.app.on('ready',this.createWindow);
        electron.ipcMain.on('asynchronous-message', (event, arg) => {
            console.log(arg)  // prints ip spero
          });
    }


    /**
     * This method create the windows and load index.html
     */
    private createWindow()
    {
        let win;
        win = new electron.BrowserWindow({width: 800, height: 600});
        win.loadURL(url.format({
            pathname: path.join(__dirname, '../resources/index.html'),
            protocol: 'file:',
            slashes: true
        }));
        win.webContents.openDevTools();
        win.on('closed', function(){
            electron.app.quit();
        });
    }
}