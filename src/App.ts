import * as net from 'net';
import * as fs from 'fs';
import * as electron from 'electron';
import * as path from 'path';
import * as url from 'url';

export class App
{
    public listen()
    {
        let num: number = 0;
        let path: string = './Downloads';
        var exist = this.statpath(path);
        if(!exist)
            fs.mkdir(path, () =>
            {
                console.log('Creating directory');
            });

        electron.app.on('ready', this.createwindow);

        electron.ipcMain.on('async-port', (event, port) =>
        {
            const server = net.createServer((socket) =>
            {
                socket.on('end', () =>
                {
                    console.log('client disconnected');
                });

                socket.on('data', (data) =>
                {
                    console.log('Receiving data\nTransfered Bytes : ' + data.length);
                    let filetosave = path + '/file' + num;
                    num++;
                    fs.open(filetosave, 'w', function(err, fd) 
                    {
                        fs.writeFile(filetosave, data, (err) =>
                        {
                            if(err) throw err;
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
            let socket = new net.Socket;
            let filetosave = file.substring(file.lastIndexOf('/'));
            console.log(filetosave);
            fs.readFile(file, 'utf8', (err, data) =>
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
                  console.log('readfile ' + file + ' err');
            });
        });
    }

    /**
     * This method create the windows and load index.html
     */
    private createwindow()
    {
        let win = new electron.BrowserWindow({width: 800, height: 600});
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

    private statpath(path)
    {
        try
        {
            return fs.statSync(path);
        }
        catch(ex)
        {
            console.error(ex);
        }
        return false;
      }
}