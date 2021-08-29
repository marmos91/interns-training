import {contextBridge, ipcRenderer}  from 'electron';
import {SEND_FILE, SELECT_FILE, START_SERVER, SET_SERVER_PORT} from './events';
contextBridge.exposeInMainWorld(
    'bridgeAPI',
    {
        updateCountDisplay: () => 
        { 
            console.log('preload:bridgeAPI:updateCountDisplay');
            ipcRenderer.send('main:request-count', {});
        },
        incrementCount: () => 
        {
            console.log('preload:bridgeAPI:incrementCount');
            ipcRenderer.send('main:increment-count', {});
            ipcRenderer.send('main:request-count', {});
        },
        decrementCount: () => 
        {
            console.log('preload:bridgeAPI:decrementCount');
            ipcRenderer.send('main:decrement-count', {});
            ipcRenderer.send('main:request-count', {});
        },
        load_file: () => 
        {
            console.log('preload: load_file');
            ipcRenderer.send(SELECT_FILE, {});
        },
        send_file: (ip: string, port: number) => 
        {
            console.log('preload: send_file: ip: ', ip, "port: ", port);
            ipcRenderer.send(SEND_FILE, {ip: ip, port: port});
        },
        get_server_port: () => 
        {
            console.log('preload: get server port');
            ipcRenderer.send(START_SERVER, {});
        }

    }
)

ipcRenderer.on('preload:set-count', (event, newCount) => {
    console.log("preload:set-count");
    document.getElementById('count').innerHTML = newCount;
})

ipcRenderer.on(SET_SERVER_PORT, (event, port) => 
{
    console.log('preload: set server port');
    document.getElementById('server-port').innerHTML = port;
});