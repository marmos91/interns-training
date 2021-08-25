import * as dgram from 'dgram';
import {Address, IMessage, MessageType} from './Interfaces';

export default class Client
{
    private _id: number;
    private _username: string;
    private _socket: dgram.Socket;
    private _server: Address;
    private readonly _server_default_address: Address = {ip: 'localhost', port: 8000};

    constructor(id: number, username: string)
    {
        this._id = id;
        this._username = username;
        this._socket = dgram.createSocket('udp4');
    }

    public connect(server: Address = this._server_default_address): Promise <Address>
    {
        const register_message: IMessage = {
            type: MessageType.REGISTRATION,
            source: {
                id: this._id,
                username: this._username
            }
        };

        //listen to messges from server
        this._socket.on('message', (msg, rinfo) => 
        {
            console.log('[CLIENT MESSAGE] ', msg)
        });

       return this._prepare_and_send_message(register_message).then(() =>
       {
           return this._server;
       });
    }

    public disconnect(): Promise <any>
    {
        const leave_message: IMessage = {
            type: MessageType.LEAVE,
            source: {
                id: this._id,
                username: this._username
            }
        };

        return this._prepare_and_send_message(leave_message).then(() => 
        {
            this._socket.close(() => 
            {
                this._socket = dgram.createSocket('udp4');
            });
        });
    }

    public send(message: string, to: number): Promise <any>
    {
        const send_message: IMessage = {
            type: MessageType.MESSAGE,
            source: {
                id: this._id,
                username: this._username
            },
            payload: message,
            destination: to
        };

        return this._prepare_and_send_message(send_message);
    }

    public broadcast(message: string): Promise<any>
    {
        const broadcast_message: IMessage = {
            type: MessageType.BROADCAST,
            source: {
                id: this._id,
                username: this._username
            },
            payload: message
        };

        return this._prepare_and_send_message(broadcast_message);
    }

    private _prepare_and_send_message(message: IMessage): Promise<void>
    {
        const message_string = JSON.stringify(message);

        return new Promise((resolve, reject) => 
        {
            this._socket.send(message_string, 0, message_string.length, this._server.port, this._server.ip, (error) => 
            {
                if(error)
                    return reject(error);
                
                resolve();
            });
        });
    }
}