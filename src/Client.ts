import * as dgram from 'dgram';
import {Address, IMessage, MessageType} from './Interfaces';

export default class Client
{
    private _id: number;
    private _username: string;
    private _socket: dgram.Socket;
    private _server: Address;
    private _server_default_address: Address = {ip: 'localhost', port: 8000};

    constructor(id: number, username: string)
    {
        this._id = id;
        this._username = username;
        this._socket = dgram.createSocket('udp4');
    }

    public connect(server: Address = {ip: 'localhost', port: 8000}): Promise <Address>
    {
        this._server = server;

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
            const received_message: IMessage = JSON.parse(msg.toString());
            console.log(`[CLIENT]: received message: ${received_message.payload} from client ${received_message.source.id}`);
        });
        // console.log(`client-${this._id}: connect: address: `, this._server_default_address.port," ", this._server.ip);
       return this._prepare_and_send_message(register_message).then(() =>
       {
            // console.log(`client-${this._id}: connect first return`);
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