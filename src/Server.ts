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

        this._socket.bind(this._port);

        if (cb)
            this._socket.on('listening', cb);
        
        this._socket.on('message', (msg, rinfo) =>
        {
            const message = <IMessage>JSON.parse(msg.toString());
            const client = this._clients[message.source.id];

            if (!client && message.type !== MessageType.REGISTRATION)
                this.sendMessage('You must send a registration message first in order to interact with the server', {ip: rinfo.address, port: rinfo.port});

            switch(message.type)
            {
                case MessageType.REGISTRATION:
                    this.registerClient(message.source.id, message.source.username, {ip: rinfo.address, port: rinfo.port});
                    break;
                case MessageType.LEAVE:
                    this.removeClient(client.id);
                    break;
                case MessageType.MESSAGE:
                    this.sendMessage(message.payload, client.address);
                    break;
                case MessageType.BROADCAST:
                    this.broadcastMessage(message.payload);
                    break;
                default:
                    throw new Error('invalid message type');
            }
        });
    }

    /**
     * Close the socket connection and instantiate a new one in order to perform another bind call
     * @param callback a callback function that is called after the server is shutted down
     */
    public shutdown(callback?: () => void): void
    {
        this._socket.close(callback);
        this._socket.on('close', () =>
        {
            this._socket = dgram.createSocket('udp4');
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
     */
    private broadcastMessage(message: string): void
    {
        // this._socket.setBroadcast(true); unsure of what is does
        this._socket.send(message, this._port);
    }

    /**
     * send a message to a client
     * @param message the message to send
     * @param address the client address
     */
    private sendMessage(message: string, address: Address): void
    {
        // this._socket.setBroadcast(false); unsure but maybe it needs
        this._socket.send(message, address.port, address.ip);
    }
}