// renderer process, for example app/renderer.js
const { ipcRenderer } = require('electron');

const file_chooser_button = document.querySelector('#file-chooser-button');
const file_sender_button = document.querySelector('#file-sender-button');

file_chooser_button
    .addEventListener('click', () => 
    {
        ipcRenderer.send('get-file');
    });

file_sender_button
    .addEventListener('click', () => 
    {
        ipcRenderer.send('send-file');
    });

ipcRenderer.on('enable-sender-button', () =>
{
    file_sender_button.removeAttribute('disabled');
})

ipcRenderer.on('disable-sender-button', () => 
{
    file_sender_button.setAttribute('disabled', 'true');
});
