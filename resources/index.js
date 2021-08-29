document.getElementById('incrementCount').addEventListener('click', () => {
    console.log('renderer:incrementCount:click')
    bridgeAPI.incrementCount()
})

document.getElementById('decrementCount').addEventListener('click', () => {
    console.log('renderer:decrementCout:click')
    bridgeAPI.decrementCount()
})

document.getElementById('button-select-file').addEventListener('click', () => 
{
    console.log('index: button select file');
    bridgeAPI.load_file();
});

document.getElementById('button-send').addEventListener('click', () => 
{
    console.log('index: button send');
    const ip = document.getElementById('input-ip');
    const port = document.getElementById('input-port');
    console.log("ip: ",ip.value," port: ", port.value);
    bridgeAPI.send_file(ip.value, port.value);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('renderer:DOMContentLoaded')
    bridgeAPI.updateCountDisplay();
    bridgeAPI.get_server_port();
})