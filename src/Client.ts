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
        this._server = {
            ip: 'localhost',
            port: 8000
        };
        this._socket = dgram.createSocket('udp4');
    }

    public connect(server?:Interfaces.Address): Promise <Interfaces.Address>
    {
        return new Promise<Interfaces.Address>((resolve, reject) =>
        {
            this._socket.bind();

            this._socket.on('listening', () =>
            {
                console.log(`[CLIENT] Listening on port ${this._socket.address().port}`)
            });

            this._socket.on('message', (msg,rinfo) =>
            {
                let message: Interfaces.IMessage;
                message = JSON.parse(msg.toString());

                switch(message.type) 
                { 
                    case Interfaces.MessageType.MESSAGE: 
                    { 
                        console.log(`${message.source.username}: ${message.payload}`)
                        break; 
                    } 
                    default: 
                    { 
                        throw new Error('Wrong message.');
                    } 
                 } 
            });

            if(server != null)
            {
                this._server.ip = server.ip;
                this._server.port = server.port;
            }

            let msg: Interfaces.IMessage = {
                type : Interfaces.MessageType.REGISTRATION,
                source : {id: this._id, username: this._username}
            };

            this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip, (err) => 
            {
                if (err)
                    reject(err);
                
                let address: Interfaces.Address = {
                    ip: this._server.ip,
                    port: this._server.port
                };

                resolve(address);
            });
        });
    }

    public disconnect(): Promise <any>
    {
        return new Promise<any>((resolve, reject) =>
        {
            let msg: Interfaces.IMessage = {
                type: Interfaces.MessageType.LEAVE,
                source: {id: this._id, username: this._username}
            };

            this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip, (err) => 
            {
                if (err)
                    reject(err);

                this._socket.close();
                this._socket = dgram.createSocket('udp4');
                resolve();
            });
            
        });
    }

    public send(message: string, to: number): Promise <any>
    {
        return new Promise<any>((resolve, reject) =>
        {
            let msg: Interfaces.IMessage = {
                type: Interfaces.MessageType.MESSAGE,
                source: {id: this._id, username: this._username},
                destination: to,
                payload: message
            };

            this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip, (err) => 
            {
                if (err)
                    reject(err);
                
                resolve();
            });
        });
    }

    public broadcast(message: string): Promise <any>
    {
        return new Promise<any>((resolve, reject) =>
        {
            let msg: Interfaces.IMessage= {
                type: Interfaces.MessageType.BROADCAST,
                source: {id: this._id, username: this._username},
                payload: message
            };

            this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip, (err) => 
            {
                if (err)
                    reject(err);
                
                resolve();
            }); 
        });
    }
}