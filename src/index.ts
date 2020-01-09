import {App} from './App';
import {app, BrowserWindow} from 'electron';

let mainWindow: BrowserWindow;

function createWindow() 
{
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile('../resources/index.html');
    mainWindow.on('closed', () => mainWindow = null);

    const app = new App(mainWindow.webContents);
    app.listen();
}

app.on('ready', createWindow)

app.on('window-all-closed', () => 
{
    if(process.platform !== 'darwin') 
        app.quit();
})

app.on('activate', () => 
{
    if(mainWindow === null) 
        createWindow();
})

