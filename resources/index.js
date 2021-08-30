document.getElementById('button-select-file').addEventListener('click', () => bridgeAPI.load_file());

document.getElementById('button-send').addEventListener('click', (event) => 
{
    const ip = document.getElementById('input-ip');
    const port = document.getElementById('input-port');
    console.log('index.js: ', ip.value, port.value);
    bridgeAPI.send_file(ip.value, port.value);
});

document.addEventListener('DOMContentLoaded', () =>  bridgeAPI.get_server_port());
