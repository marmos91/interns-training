import {Socket, AddressInfo, createSocket} from 'dgram';
import {Address, IMessage, MessageType, IClient} from './Interfaces';
import * as Interfaces from './Interfaces';
import * as dgram from 'dgram';

class Client
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

    public static json_to_message(message: Buffer): IMessage
    {
        return JSON.parse(message.toString());
    };

    public connect(server?:Interfaces.Address): Promise <Interfaces.Address>
    {
        return new Promise<Interfaces.Address>((resolve, reject) =>
        {
            this._socket.bind();

            this._socket.on('message', (msg,_rinfo) =>
            {
                let message: Interfaces.IMessage;
                message = JSON.parse(msg.toString());
                this._server.ip = server.ip;
                this._server.port = server.port;
            });
        });
    }

    public disconnect()
    {
            let msg: Interfaces.IMessage = 
            {
                type: Interfaces.MessageType.LEAVE,
                source: 
                {
                    id: this._id, 
                    username: this._username
                }
            };
                this._socket.close();
                this._socket = dgram.createSocket('udp4');
    };

    public registration(message: string, server: number)
    {
        let msg: Interfaces.IMessage =
        {
            type: Interfaces.MessageType.REGISTRATION,
            source: 
            {
                id: this._id, 
                username: this._username
            },
            destination: this._server.port,
            payload: message
        }
    }

    public send_message(message: string, peer: number)
    {
        let msg: Interfaces.IMessage = 
        {
            type: Interfaces.MessageType.MESSAGE,
            source: 
            {
                id: this._id,
                username: this._username
            },
            destination: peer,
            payload: message
        };
        this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip);
    };

    public broadcast(message: string)
    {
        let msg: Interfaces.IMessage= 
        {
            type: Interfaces.MessageType.BROADCAST,
            source: 
            {
                id: this._id,
                username: this._username
            },
            payload: message
        };
      this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip)
    };


};

export default Client