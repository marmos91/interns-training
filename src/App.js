import * as net from 'net';
import * as electron from 'electron';
const path = require('path');
const url = require('url');

class App
{
     _socket;
    listen(){
        this._socket = net.createServer();
        let win = new electron.BrowserWindow({width: 800, height: 600});
        win.loadURL(url.format({
            pathname: path.join('../resources/index.html'),
            protocol: 'file:',
            slashes: true
        }))

// Load a remote URL
        win.loadURL('https://github.com');
        console.log('aperto\n');
    }
}

exports.App = App;