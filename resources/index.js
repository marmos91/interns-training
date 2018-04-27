var electron = require("electron");
let p = getRandom(0, 65536);
document.querySelector('#send').addEventListener("click", bottoneCliccato);
document.querySelector('#porta').innerHTML = `<p>Server is listening on port ${p}</p>`;

function bottoneCliccato()
{
    let ip = document.querySelector('.Ip').value;
    let port = document.querySelector('.port').value;
    if (ip && port && port < 65536 && port > 0)
    {
        document.querySelector('#output').innerHTML = `<p>Invio a indirizzo ip=${ip} port=${port} </p>`;
        electron.ipcRenderer.sendSync(ip);
    }
    else
    {
        document.querySelector('#output').innerHTML = `
        <article class="message is-danger">
        <p>Seleziona una porta e un ip address validi</p>
        </article>`;
    }
}

function getRandom(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}