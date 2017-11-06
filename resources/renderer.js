const {ipcRenderer} = require('electron');

(function init()
{
    ipcRenderer.on('response', (event, text) => {
        setStatus(text);
        toggleSendButton("on");
    });
    ipcRenderer.on('received', (event, text) => {
        setStatus(text);
    });
    ipcRenderer.on('server-port', (event, port) => {
        setServerListeningPort(port);
    });
    ipcRenderer.send('server-port');
}());

function send()
{
    let hostAddr = document.getElementById("input_host").value;
    let hostPort = document.getElementById("input_port").value;    
    let file = document.getElementById("input_file").files[0];
    if (!hostAddr || !hostPort || !file)
    {
        setStatus("Please insert a valid input.");
        return;
    }
    let reader = new FileReader();
    reader.onload = () =>
    {
        let arrayBuffer = reader.result
        let bytes = new Uint8Array(arrayBuffer);
        ipcRenderer.send('send-request', bytes, file.name, hostAddr, hostPort);
        setStatus("Sending data ...");
        toggleSendButton("off");
    }
    reader.readAsArrayBuffer(file);
}

function setStatus(string) 
{
    document.getElementById("status").innerHTML = string;    
}

function setServerListeningPort(port) 
{
    document.getElementById("listening_port").innerHTML += port;    
}

function toggleSendButton(state)
{
    if (state === "on")
        document.getElementById("button_send").disabled = false;
    if (state === "off")
        document.getElementById("button_send").disabled = true;
}