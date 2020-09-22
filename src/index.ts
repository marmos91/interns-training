import {App} from './App';
import {app, BrowserWindow} from 'electron';
let mainWindow;


function createWindow() 
{
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    mainWindow.webContents.openDevTools();

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile('../resources/index.html');

    new App(mainWindow.webContents).listen();
}

app.on('ready', createWindow)
