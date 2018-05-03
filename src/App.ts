import * as net from 'net';
const fs = require('fs');
const electron = require('electron');
const path = require('path');
const url = require('url');


export class App
{

    public listen()
    {
        let num: number = 0;
        let path: string = './Downloads';
        var exist = this.statPath(path);
        if(!exist)
        {
            fs.mkdir(path);
        }
        electron.app.on('ready', this.createWindow);

        electron.ipcMain.on('async-port', (event, port) =>
        {
            const server = net.createServer((socket) =>
            {

                socket.on('end', () =>
                {
                    console.log('client disconnected');
                });

                socket.on('data',(data) =>
                {
                    console.log('Receiving data\nTransfered Bytes : ' + data.length);
                    let fileToSave = path + '/file' + num;
                    num++;
                    console.log(fileToSave);
                    fs.open(fileToSave, "w", function (err, fd) 
                    {
                        fs.writeFile(fileToSave, data, (err) =>
                        {
                            if (err) throw err;
                            console.log('The file has been saved!');
                        });
                    });
                });
            });

            server.listen(port, () =>
            {
                console.log('server is listening on port ' + port);
            });

            server.on('error', (err) =>
            {
                throw err;
            });
    
            server.on('connection',() =>
            {
                console.log('Connection to client established');
            });

        });

        electron.ipcMain.on('async', (event, ip, port, file) =>
        {
            var socket = new net.Socket;
            var fileToSave = file.substring(file.lastIndexOf("/"));
            console.log(fileToSave);
            fs.readFile(file, "utf8", (err, data) =>
            {
                if(!err)
                {
                    socket.connect(port, ip);
                    socket.write(data, () =>
                    {
                      console.log('Sending file');
                    });
                }
                else
                {
                  console.log('readfile ' + file + ' err');
                }
            });

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
        //win.webContents.openDevTools();
        win.on('closed', function()
        {
            electron.app.quit();
        });
    }

    private statPath(path)
    {
        try 
        {
          return fs.statSync(path);
        }
        catch (ex) {}
        return false;
      }
}