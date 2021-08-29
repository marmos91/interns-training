const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const overseer = {
    'count': 0 
}

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js')
        }
    })
    
    win.loadFile('index.html')

    win.webContents.openDevTools()

}

app.whenReady().then(() => {
    createWindow()
})

ipcMain.on('main:increment-count', (event, payload) => {
    console.log('main:increment-count')
    overseer.count += 1
})

ipcMain.on('main:request-count', (event, payload) => {
    console.log('main:request-count')
    event.reply('preload:set-count', overseer.count)
})