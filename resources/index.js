const {remote} = require('electron');
const net = require('net');

const $input_address = document.querySelector('#input_address');
const $input_port = document.querySelector('#input_port');
const $input_file = document.querySelector('#input_file');
const $port = document.querySelector('#port');
const $transfer_status = document.querySelector('#transfer-status');

const server_port = remote.getGlobal('port');
$port.innerHTML = server_port;

function sendFile(file, port, address)
{
    const client = net.connect(port, address);

    client.on('connect', () =>
    {
        const fr = new FileReader();
        fr.onload = () =>
        {
            if (fr.readyState === 2)
            {
                const payload = {
                    file: fr.result,
                    name: file.name,
                    type: file.type.split('/')[1],
                    size: file.size
                }
                $transfer_status.innerHTML = 'Transfer in progress...';
                client.end(Buffer.from(JSON.stringify(payload)));
            }
        }
        fr.readAsText(file);
    });

    client.on('close', () =>
    {
        $transfer_status.innerHTML = 'Transfer completed!';
        setInterval(() => $transfer_status.innerHTML = '', 5000);
    });
}

function sendButtonHandler(event)
{
    const remote_port = $input_port.value;
    const file = $input_file.files[0];
    let remote_address = $input_address.value;

    if (!remote_address)
        remote_address = $input_address.value = 'localhost';

    if (remote_port && file)
        sendFile(file, remote_port, remote_address);
}