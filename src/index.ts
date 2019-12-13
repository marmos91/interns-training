import {App} from './App';
import {app, BrowserWindow} from 'electron';

let main_window: BrowserWindow;

function createWindow()
{
    main_window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
    });

    main_window.loadURL(`file://${__dirname}/../resources/index.html`);
}

app.on('ready', createWindow);

new App('/Users/cubbit/Desktop/tmp').listen((port) =>
{
    global['port'] = port;
    console.log(`Server listening on port ${port}`);
});
