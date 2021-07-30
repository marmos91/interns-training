import { app, BrowserWindow } from "electron";
import * as path from "path";

export class ElectronStarter
{
    private _index_file_path = './resources/index.html';
    private _preload_file_path = path.join(__dirname, 'preload/index.js');
    private _window?: BrowserWindow;

    constructor()
    {
        app.whenReady()
            .then(this._on_app_ready.bind(this));

        app.on('window-all-closed', this._on_window_closed.bind(this));
    }

    public get window()
    {
        return this._window;
    }

    private _on_app_ready()
    {
        this._create_window();

        app.on('activate', this._on_app_activate);
    }

    private _on_window_closed()
    {
        if (process.platform !== 'darwin')
            app.quit();
    }

    private _on_app_activate()
    {
        if (BrowserWindow.getAllWindows().length === 0)
            this._create_window();
    }

    private _create_window()
    {
        const window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: this._preload_file_path,
                nodeIntegration: false,
            }
        });

        window.loadFile(this._index_file_path);

        this._window = window;
    }
}