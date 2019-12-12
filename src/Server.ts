import { IClient, IMessage, MessageType, Address } from './Interfaces';
import * as dgram from 'dgram';

/**
 * An udp4 socket chat server with the ability to send and broadcast messages to connected clients.
 */
export default class Server
{
    private _port: number;
    private _socket: dgram.Socket;
    private _clients: {[id: number]: IClient};

    constructor()
    {
        this._socket = dgram.createSocket('udp4');
        this._clients = {};
    }

    /**
     * Starts the server. Bind a port to a socket and start listening for incoming messages.
     * @param port the port to bind the socket at
     * @param callback a callback function that is called after the server is started
     */
    public listen(port?: number | ((port: number) => void), callback?: (port: number) => void)
    {
        this._port = typeof port === 'number' ? port : 8000;
        const cb = typeof port === 'function'? port : callback;

        this._socket.on('error', (err) =>
        {
            throw new Error(err.message);
        });
        
        this._socket.bind(this._port);

        if (cb)
            this._socket.on('listening', () => cb(this._port));
        
        this._socket.on('message', (msg, rinfo) =>
        {
            const message = <IMessage>JSON.parse(msg.toString());

            if (!this._clients[message.source.id] && message.type !== MessageType.REGISTRATION)
                this._send('You must send a registration message first in order to interact with the server', {port: rinfo.port, ip: rinfo.address});

            switch(message.type)
            {
                case MessageType.REGISTRATION:
                    this.registerClient(message.source.id, message.source.username, {ip: rinfo.address, port: rinfo.port});
                    break;
                case MessageType.LEAVE:
                    this.removeClient(message.source.id);
                    break;
                case MessageType.MESSAGE:
                    this.sendMessage(message.payload, message.destination);
                    break;
                case MessageType.BROADCAST:
                    this.broadcastMessage(message.payload, message.source.id);
                    break;
                default:
                    throw new Error('invalid message type');
            }
        });

        this._socket.on('close', () =>
        {
            console.log('socket closed');
        });
    }

    /**
     * Close the socket connection and instantiate a new one in order to perform another bind call
     * @param callback a callback function that is called after the server is shutted down
     */
    public shutdown(callback?: () => void): void
    {
        this._socket.close(() =>
        {
            this._socket = dgram.createSocket('udp4');
            this._clients = {};
            callback();
        });
    }

    /**
     * Add a client to the dictionary of connected clients.
     * It throws an error if the client is already registered.
     * @param id the client's id
     * @param username the client username
     * @param address the Address of the client
     */
    private registerClient(id: number, username: string, address: Address): void
    {
        if (id in this._clients)
            throw new Error(`client ${id} already registered as ${username}`);
        this._clients[id] = {id, username, address};
    }

    /**
     * Remove a client from the dictionary of connected clients.
     * @param id the id corresponding to the client to be removed
     */
    private removeClient(id: number): void
    {
        delete this._clients[id];
    }

    /**
     * broadcast a message to connected clients
     * @param message the message to be broadcasted
     * @param from the sender client id
     */
    private broadcastMessage(message: string, from: number): void
    {
        for(const client of Object.values(this._clients))
            if (client.id !== from)
                this.sendMessage(message, client.id);
    }

    /**
     * send a message to a client
     * @param message the message to send
     * @param to the client id where the message will be sent
     */
    private sendMessage(message: string, to: number): void
    {
        const destination_address = this._clients[to].address;
        this._send(message, destination_address);
    }

    private _send(message: string, address: Address)
    {
        const message_str = JSON.stringify(message);
        const buf = Buffer.from(message_str);
        const bufLength = Buffer.byteLength(message_str);
        this._socket.send(buf, 0, bufLength + 1, address.port, address.ip);
    }
}