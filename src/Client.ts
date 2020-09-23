import * as dgram from 'dgram';
import {Address, IMessage, MessageType} from './Interfaces';

class Client
{
    private _id: number;
    private _username: string;
    private _socket: dgram.Socket;
    private _server: Address;

    constructor(id: number, username: string) 
    {
        this._id = id;
        this._username = username;
    }

    public connect(server: Address = {ip: 'localhost', port: 8000}): Promise<Address>
    {
        const {port, ip} = server;

        this._server = server;
        this._socket = dgram.createSocket("udp4");

        this._socket.on('message', this._message_get);

        const registration_message: IMessage =
        {
            type: MessageType.REGISTRATION,
            source: 
            {
                id: this._id,
                username: this._username
            }
        };

        return new Promise(resolve => 
            this._socket.send(JSON.stringify(registration_message), port, ip, () => resolve(server))
        );
    }

    public send(message: string, to: number): Promise<void>
    {
        if (!this._can_send())
            return Promise.resolve();

        const {port, ip} = this._server;

        const message_obj: IMessage =
        {
            type: MessageType.MESSAGE,
            source: 
            {
                id: this._id,
                username: this._username
            },
            payload: message,
            destination: to
        };

        return new Promise(resolve => this._socket.send(JSON.stringify(message_obj), port, ip, () => resolve()));
    }

    public broadcast(message: string): Promise<void>
    {
        if (!this._can_send())
            return Promise.resolve();

        const {port, ip} = this._server;

        const message_obj: IMessage =
        {
            type: MessageType.BROADCAST,
            source: 
            {
                id: this._id,
                username: this._username
            },
            payload: message
        };

        return new Promise(resolve => this._socket.send(JSON.stringify(message_obj), port, ip, () => resolve()));
    }

    public async disconnect(): Promise<void> 
    {
        if (!this._can_send())
            return Promise.resolve();

        const {port, ip} = this._server;
        
        const message_obj: IMessage =
        {
            type: MessageType.LEAVE,
            source: 
            {
                id: this._id,
                username: this._username
            }
        };

        await new Promise(resolve => this._socket.send(JSON.stringify(message_obj), port, ip, resolve));
        
        this._socket = undefined;
        this._server = undefined;

        return Promise.resolve();
    }

    private _message_get(buffer: Buffer): void
    {
        console.log(buffer.toString());
    }

    private _can_send(): boolean
    {
        return Boolean(this._server && this._socket);
    }
}

export default Client;