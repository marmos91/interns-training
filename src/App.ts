import {app, BrowserWindow, ipcMain} from 'electron';
import {EventEmitter} from 'events';
import {createServer, Socket} from 'net';
import {writeFileSync} from 'fs';
const path = require('path');
const url = require('url');

export class App extends EventEmitter
{
    private _window;
    private _listeningPort;
    private _server;
    private _client;

    /**
     * Constructor of App class.
     */
    constructor()
    {
        super();
        this._initServer();
        this._initClient();
        app.on('ready', () => {this._createWindow();});
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') 
                app.quit();
        });
        app.on('activate', () => {
            if (this._window === null) 
                this._createWindow();
        });
    }

    /**
     * Starts listening for connection.
     */
    public listen()
    {
        if (this._window) 
            this._listen();
        else 
            this.once('window-ready', () => 
            { 
                this._listen();
            });
    }

    /**
     * Utility method to avoid repeated code
     */
    private _listen()
    {
        this._listeningPort = this._getRandomPort();
        this._server.listen(
        {
            host: 'localhost',
            port: this._listeningPort,
            exclusive: false
        }, () =>
        {
            ipcMain.on('server-port', (event) => {event.sender.send('server-port', this._listeningPort);});
            console.log("Server started listening on port " + this._listeningPort + ".");
        });
    }

    /**
     * Init TCP server
     */
    private _initServer()
    {
        this._server = createServer((socket) => {this._connectionHandler(socket);});
        this._server.on('error', (err) => {
            throw err;
        });
    }

    /**
     * Server's connection handler
     * @param socket
     */
    private _connectionHandler(socket)
    {
        console.log('client connected');
        socket.on('end', () => 
        {
            console.log('client disconnected');
        });
        socket.on('error', (err) =>
        {
            this._window.webContents.send('received', "Error while receiving: " + err);
        });
        socket.on('data', (data) =>
        {
            this._window.webContents.send('received', "Receiving file...");
            try 
            {
                let obj = JSON.parse(data);
                writeFileSync("received/" + obj.name, new Buffer(obj.data));
                this._window.webContents.send('received', "File received (Ready)");
            } catch(err)
            {
                this._window.webContents.send('received', "Error while receiving: " + err);
            } finally
            {
                socket.end();
            }
        });
    }

    /**
     * Init TCP client
     */
    private _initClient()
    {
        this._client = new Socket();
        this._client.on('error', (err) => 
        {
            this._window.webContents.send('response', "Error: " + err);
        });
        ipcMain.on('send-request', (event, bytes, fileName, hostAddr, hostPort) => 
        {
            this._client.connect(hostPort, hostAddr, () => 
            {
                try
                {
                    this._client.write(JSON.stringify({name: fileName, data: bytes}));
                    event.sender.send('response', "Success! (Ready)");
                } catch(err)
                {
                    event.sender.send('response', "Something went wrong:" + err);
                } finally 
                {
                    this._client.end();
                }
            });   
        });
    }

    /**
     * Build the GUI
     */
    private _createWindow()
    {
        this._window = new BrowserWindow({width: 800, height: 600});
        this._window.loadURL(url.format(
        {
            pathname: path.join(__dirname + "/../resources/", 'index.html'),
            protocol: 'file:',
            slashes: true
        }));
        this._window.on('closed', () => {
            this._window = null
        });
        this.emit('window-ready');
    }

    /**
     * @return a random port in range [1024..65535]
     */
    private _getRandomPort()
    {
        return Math.floor(Math.random() * (65536 - 1024)) + 1024;
    }
}