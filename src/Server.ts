import * as dgram from 'dgram'
import * as Interfaces from './Interfaces'

export default class Server
{
    private _port: number = 8000;
    private _socket: dgram.Socket;
    private _clients: {[id: number] : Interfaces.IClient};

    constructor()
    {
        this._port = 8000;
        this._socket = dgram.createSocket('udp4');
        this._clients = {}
    }

    public listen(port?: number | ((port: number) => void), callback?: (port: number) => void): void
    {
        if(typeof port === 'number') {
            this._port = port;
        }

        this._socket.on('listening', () => {
            const address = this._socket.address();
            // console.log(`[SERVER] server listening ${address.address}:${address.port}`);
        });

        this._socket.on('message', (msg, rinfo) =>
        {
            let message: Interfaces.IMessage;
            message = JSON.parse(msg.toString());
            this._on_message(message, rinfo);
            
        });

        this._socket.on('error', console.log);

        this._socket.on('close', () => console.log('[SERVER] stopping ...'));
        
        this._socket.bind({port: this._port}, () => 
        {
            if(typeof port === 'function')
                port(this._port);
            else 
                callback(this._port);
        });
    }
    
    public shutdown(callback?: any): void
    {
        this._socket.close(() =>
        {
            this._socket = dgram.createSocket('udp4');
            this._clients = {};
            callback();
        });
    }

    private _on_message(message: Interfaces.IMessage, rinfo: dgram.AddressInfo): void
    {
        switch(message.type) 
        { 
            case Interfaces.MessageType.REGISTRATION: 
            {
                let cli: Interfaces.IClient = {
                    id: message.source.id,
                    username: message.source.username,
                    address: {ip: rinfo.address, port: rinfo.port}
                };

                this._clients[cli.id] = cli;
                break; 
            } 
            case Interfaces.MessageType.BROADCAST: 
            { 
                let msg: Interfaces.IMessage = {
                    type: Interfaces.MessageType.MESSAGE,
                    source: message.source
                };

                for(let key in this._clients)
                {
                    if(Number(key) === message.source.id)
                        continue;

                    const to: Interfaces.Address = this._clients[key].address;
                    this._socket.send(JSON.stringify(msg), to.port,to.ip);
                }
                
                break;  
            } 
            case Interfaces.MessageType.MESSAGE: 
            { 
                let msg: Interfaces.IMessage = {
                    type: Interfaces.MessageType.MESSAGE,
                    source: message.source
                };

                const to: Interfaces.Address = this._clients[message.destination].address;
                this._socket.send(JSON.stringify(msg), to.port,to.ip);
                break; 
            } 
            case Interfaces.MessageType.LEAVE: 
            { 
                delete this._clients[message.source.id];
                break; 
            } 
            default: 
            { 
                throw new Error();
            } 
        } 
    }    
}
