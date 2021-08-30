import {contextBridge, ipcRenderer}  from 'electron';
import {SEND_FILE, SELECT_FILE, START_SERVER, SET_SERVER_PORT, FILE_TRANSFER_UPDATE} from './events';

contextBridge.exposeInMainWorld(
    'bridgeAPI',
    {
        load_file: () => ipcRenderer.send(SELECT_FILE, {}),
        
        send_file: (ip: string, port: number) =>  ipcRenderer.send(SEND_FILE, {ip: ip, port: port}),
      
        get_server_port: () =>  ipcRenderer.send(START_SERVER, {})
    }
);

ipcRenderer.on(FILE_TRANSFER_UPDATE, (event, transfer_info) => 
{
    document.getElementById('transfer-information').innerHTML = transfer_info;
});

ipcRenderer.on(SET_SERVER_PORT, (event, port) => 
{
    document.getElementById('server-port').innerHTML = port;
});