import * as dgram from 'dgram';
import {IClient, IMessage, MessageType, Address} from './Interfaces';

class Server 
{
    private _port: number;
    private _socket: dgram.Socket;
    private _clients: Record<number, IClient>;

    constructor() 
    {
        this._on_message = this._on_message.bind(this);
    }

    async listen(port?: number | ((port: number) => void), callback?: (port: number) => void): Promise<void>
    {
        this._port = typeof port === 'number' ? port : 8000;
        this._socket = dgram.createSocket("udp4");
        this._clients = {};

        await new Promise(resolve => this._socket.bind(this._port, undefined, resolve));
        this._socket.on('message', this._on_message);

        if (typeof callback === 'function') 
            callback(this._port);
        else if (typeof port === 'function')
            port(this._port);
    }

    shutdown(callback?: () => void): void
    {
        if (!this._socket)
            return;

        this._socket.close(callback);
        this._socket = undefined;
        this._port = undefined;
        this._clients = undefined;
    }

    private _on_message(buffer: Buffer, rinfo: dgram.AddressInfo): void
    {
        const {address, port} = rinfo;

        const message: IMessage = JSON.parse(buffer.toString());
        
        switch (message.type) 
        {
            case MessageType.REGISTRATION:
                this._add_client(message, {ip: address, port});
                break;
            case MessageType.MESSAGE:
                this._send_message(message);
                break;
            case MessageType.BROADCAST:
                this._broadcast(message);
                break;
            case MessageType.LEAVE:
                this._remove_client(message);
                break;
            default:
                break;
        }
    }

    private _add_client(message: IMessage, address: Address): void
    {
        const {source: {id, username}} = message;

        if (this._clients[id]) 
            return;

        this._clients[id] = {id, username, address};
    }

    private _send_message(message: IMessage): void
    {
        const {payload, destination} = message;
        const client = this._clients[destination];

        if (!client)
            return;

        const {address: {ip, port}} = client;

        this._socket.send(payload, port, ip);
    }

    private _broadcast(message: IMessage): void
    {
        Object.keys(this._clients).forEach(key => 
        {
            this._send_message({...message, destination: +key});
        });
    }

    private _remove_client(message: IMessage): void
    {
        const {source: {id}} = message;

        this._clients[id] = undefined;
    }
}

export default Server;
