import * as dgram from 'dgram';
import {IClient, IMessage, MessageType, Address} from './Interfaces';

class Server 
{
    private _port: number;
    private _socket: dgram.Socket;
    private _clients: {[id: number] : IClient};
    constructor() 
    {
        this._onMessage = this._onMessage.bind(this);
    }
    async listen(port?: number | ((port: number) => void), callback?: (port: number) => void)
    {
        this._port = typeof port === 'number' ? port : 8000;
        this._socket = dgram.createSocket("udp4");
        this._clients = {};

        await new Promise(resolve => this._socket.bind(this._port, undefined, resolve));
        this._socket.on('message', this._onMessage);

        if (typeof callback === 'function') 
            callback(this._port);
        else if (typeof port === 'function')
            port(this._port);
    };
    shutdown(callback?: () => void) 
    {
        if (!this._socket)
            return;
        this._socket.close(callback);
        this._socket = undefined;
        this._port = undefined;
        this._clients = undefined;
    };
    private _onMessage(buffer: Buffer, rinfo: dgram.AddressInfo) 
    {
        const {address, port} = rinfo;
        const message: IMessage = JSON.parse(buffer.toString());
        switch (message.type) 
        {
            case MessageType.REGISTRATION:
                this._addClient(message, {ip: address, port});
                break;
            case MessageType.MESSAGE:
                this._sendMessage(message);
                break;
            case MessageType.BROADCAST:
                this._broadcast(message);
                break;
            case MessageType.LEAVE:
                this._removeClient(message);
                break;
            default:
                break;
        }
    };
    private _addClient(message: IMessage, address: Address) 
    {
        const {source: {id, username}} = message;
        if (this._clients[id]) 
            return;
        this._clients[id] = {id, username, address};
    };
    private _sendMessage(message: IMessage)
    {
        const {payload, destination} = message;
        const client = this._clients[destination];
        if (!client)
            return;
        const {address: {ip, port}} = client;
        this._socket.send(payload, port, ip);
    };
    private _broadcast(message: IMessage) 
    {
        const {payload} = message;
        Object.keys(this._clients).map(key => 
        {
            this._sendMessage({...message, destination: +key});
        });
    }
    private _removeClient(message: IMessage)
    {
        const {source: {id}} = message;
        this._clients[id] = undefined;
    }
}

export default Server;
