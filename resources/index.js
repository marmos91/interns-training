const electron = require('electron');
const {ipcRenderer} = electron;
let p = getrandom(0, 65536);
ipcRenderer.send('async-port',p);
document.querySelector('#send').addEventListener("click", clickedbotton);
document.querySelector('#porta').innerHTML = `<p>Server is listening on port ${p}</p>`;

/**
 * this function collect the value of ip,port and file and sends them to the main
 * process when the button is clicked
 */
function clickedbotton()
{
    let file = document.querySelector('#inputId').files[0].path;
    let ip = document.querySelector('.Ip').value;
    let port = document.querySelector('.port').value;
    if (ip && port && port < 65536 && port > 0 && file)
    {
        document.querySelector('#output').innerHTML = `<p>Sending file to ${ip}:${port}</p>`;
        ipcRenderer.send('async', ip, port, file);
    }
    else
    {
        document.querySelector('#output').innerHTML = `
        <article class="message">
        <p>fill the form</p>
        </article>`;
    }
}

/**This function generate a random number between two extremes (which are included)
 * 
 * @param {*} min 
 * @param {*} max 
 */
function getrandom(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}