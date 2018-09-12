import * as dgram from 'dgram'
import * as Interfaces from './Interfaces'

export default class Client
{
    private _id: number;
    private _username: string;
    private _socket: dgram.Socket;
    private _server: Interfaces.Address;

    constructor(id: number, username: string)
    {
        this._id = id;
        this._username = username;
        this._server.ip = 'localhost';
        this._server.port = 8000;
    }

    public connect(server?:Interfaces.Address): Promise <Interfaces.Address>
    {
        console.log('0');
        return new Promise((resolve, reject) =>
        {
            this._socket.bind();
            this._socket.on('message', (msg,rinfo) =>
            {
                let message: Interfaces.IMessage;
                message = JSON.parse(msg.toString());

                switch(message.type) { 
                    case Interfaces.MessageType.MESSAGE: 
                    { 
                        console.log(`${message.source.username}: ${message.payload}`)
                        break; 
                    } 
                    default: 
                    { 
                        throw new Error('Wrong message.');
                        
                        break; 
                    } 
                 } 
            })

            if(server != null)
            {
                console.log('1');
                this._server.ip = server.ip;
                this._server.port = server.port;
            }
            console.log('2');
            let msg: Interfaces.IMessage;
            msg.type = Interfaces.MessageType.REGISTRATION;
            msg.source.id = this._id;
            msg.source.username = this._username;
            this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip, (err) => 
            {
                if (err)
                    reject();
                
                let address: Interfaces.Address;
                address.ip = this._server.ip;
                address.port = this._server.port;
                resolve(address);
            });

        })
    }

    public disconnect(): Promise <any>
    {
        return new Promise((resolve, reject) =>
        {
            let msg: Interfaces.IMessage;
            msg.type = Interfaces.MessageType.LEAVE;
            msg.source.id = this._id;
            msg.source.username = this._username;
            this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip, (err) => 
            {
                if (err)
                    reject();
                this._socket.close();
                resolve();
            });
            
        });
    }

    public send(message: string, to: number): Promise <any>
    {
        return new Promise((resolve, reject) =>
        {
            let msg: Interfaces.IMessage;
            msg.type = Interfaces.MessageType.MESSAGE;
            msg.source.id = this._id;
            msg.source.username = this._username;
            msg.destination = to;
            msg.payload = message;
            this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip, (err) => 
            {
                if (err)
                    reject();
                
                resolve();
            });
        });
    }

    public broadcast(message: string): Promise <any>
    {
        return new Promise((resolve, reject) =>
        {
            let msg: Interfaces.IMessage;
            msg.type = Interfaces.MessageType.BROADCAST;
            msg.source.id = this._id;
            msg.source.username = this._username;
            msg.payload = message;
            this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip, (err) => 
            {
                if (err)
                    reject();
                
                resolve();
            }); 
        });
    }
}