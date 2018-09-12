import * as dgram from 'dgram'
import * as Interfaces from './Interfaces'
import { RSA_NO_PADDING } from 'constants';

export default class Server
{
    private _port: number = 8000;
    private _socket: dgram.Socket;
    private _clients: {[id: number] : Interfaces.IClient};

    public listen(port?: number | ((port: number) => void), callback?: (port: number) => void): void
    {
        if(typeof port === 'number')
            this._port = port;
        console.log(`Server Port: ${this._port}`)
        this._socket.on('message', (msg, rinfo) =>
        {
            let message: Interfaces.IMessage;
            message = JSON.parse(msg.toString());

            switch(message.type) { 
                case Interfaces.MessageType.REGISTRATION: 
                {
                    let cli: Interfaces.IClient
                    cli.id = message.source.id;
                    cli.username = message.source.username;
                    cli.address.ip = rinfo.address;
                    cli.address.port = rinfo.port;

                    this._clients[cli.id] = cli;
                    break; 
                } 
                case Interfaces.MessageType.BROADCAST: 
                { 
                    let msg: Interfaces.IMessage;
                    msg.type = Interfaces.MessageType.MESSAGE;
                    msg.source = message.source;

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
                    let msg: Interfaces.IMessage;
                    msg.type = Interfaces.MessageType.MESSAGE;
                    msg.source = message.source;

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
                    
                    break; 
                } 
             } 
        });

        this._socket.bind({port: this._port}, callback);
    }
    
    public shutdown(callback?: any): void
    {
        this._socket.close;
    }

    
}
