import * as dgram from 'dgram';
import {Address, IMessage, MessageType} from './Interfaces';

export default class 
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
    async connect(server: Address = {ip: 'localhost', port: 8000}): Promise<Address>
    {
        const {port, ip} = server;
        this._server = server;
        this._socket = dgram.createSocket("udp4");

        this._socket.on('message', this._messageGet);

        const registrationMessage: IMessage =
        {
            type: MessageType.REGISTRATION,
            source: 
            {
                id: this._id,
                username: this._username
            }
        };

        await new Promise(resolve => this._socket.send(JSON.stringify(registrationMessage), port, ip, resolve));

        return Promise.resolve(server);
    }
    async send(message: string, to: number): Promise<any>
    {
        if (!this._canSend())
            return Promise.resolve();
        const {port, ip} = this._server;
        const messageObj: IMessage =
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
        await new Promise(resolve => this._socket.send(JSON.stringify(messageObj), port, ip, resolve));
        return Promise.resolve();
    }
    async broadcast(message: string): Promise<any>
    {
        if (!this._canSend())
            return Promise.resolve();
        const {port, ip} = this._server;
        const messageObj: IMessage =
        {
            type: MessageType.BROADCAST,
            source: 
            {
                id: this._id,
                username: this._username
            },
            payload: message
        };
        await new Promise(resolve => this._socket.send(JSON.stringify(messageObj), port, ip, resolve));
        return Promise.resolve();
    }
    async disconnect(): Promise<any> 
    {
        if (!this._canSend())
            return Promise.resolve();
        const {port, ip} = this._server;
        const messageObj: IMessage =
        {
            type: MessageType.LEAVE,
            source: 
            {
                id: this._id,
                username: this._username
            }
        };
        await new Promise(resolve => this._socket.send(JSON.stringify(messageObj), port, ip, resolve));
        this._socket = undefined;
        this._server = undefined;

        return Promise.resolve();
    }
    private _messageGet(buffer: Buffer) 
    {
        console.log(buffer.toString());
    }
    private _canSend() 
    {
        return this._server && this._socket;
    }
}