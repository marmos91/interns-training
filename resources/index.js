const {ipcRenderer, remote} = require('electron');
console.log(remote);
const {dialog} = require('electron').remote;

const file_chooser_button = document.querySelector('#file-chooser-button');
const file_sender_button = document.querySelector('#file-sender-button');
const transfer_text = document.querySelector('#transfer-text');
const port_input = document.querySelector('#port-input');
const ip_input = document.querySelector('#ip-input');

file_chooser_button.addEventListener('click', () => 
{
    ipcRenderer.send('get-file');
});

file_sender_button.addEventListener('click', () => 
{
    const ip = ip_input.value;
    const port = Number(port_input.value);

    if (ip === '' || port === 0) 
    {
        dialog.showMessageBox({
            type: 'warning',
            message: 'Please insert IP and port of the destination first'
        });
        return;
    }

    ipcRenderer.send('send-file', { ip, port });
    transfer_text.textContent = 'Transfer in progress...';
});

ipcRenderer.on('enable-sender-button', () =>
{
    file_sender_button.removeAttribute('disabled');
});

ipcRenderer.on('disable-sender-button', () => 
{
    file_sender_button.setAttribute('disabled', 'true');
});

ipcRenderer.on('set-port', (event, port) => 
{
    document.querySelector('#port-text').textContent = port;
});

ipcRenderer.on('transfer-completed', () => 
{
    transfer_text.textContent = 'Transfer completed!';
});

ipcRenderer.on('transfer-received', () => 
{
    transfer_text.textContent = 'Transfer received!';
});

ipcRenderer.on('transfer-failed', () => 
{
    transfer_text.textContent = 'Transfer failed!';
}); 

ipcRenderer.on('set-filepath', (event, filepath) =>
{
    file_chooser_button.value = filepath;
});