const net = require('net');
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

export class App
{
    public listen()
    {
        let server = net.createServer();
        let port = this.getRandom(0,65536);
        server.listen(port);
        app.on('ready',this.createWindow)
    }

    /**
     * This method create the windows and load index.html
     */
    private createWindow()
    {
        let win;
        win = new BrowserWindow({width: 800, height: 600});
        win.loadURL(url.format({
            pathname: path.join(__dirname, '../resources/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    /**
     * this method generate a random number between min and max extremes included
     * @param min
     * @param max
     * @returns {any}
     */
    private getRandom(min, max)
    {    
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}