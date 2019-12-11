import { IClient, IMessage, MessageType } from "./Interfaces";
import * as dgram from 'dgram';

export default class Server
{
    private _port: number;
    private _socket: dgram.Socket;
    private _clients: {[id: number] : IClient};

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
    listen(port?: number | ((port: number) => void), callback?: (port: number) => void)
    {
        this._port = typeof port === 'number' ? port : 8000;
        let cb = typeof port === 'function'? port : callback;

        this._socket.bind(this._port);
        
        if (cb)
            this._socket.on('listening', cb);
        
        this._socket.on('message', (msg, rinfo) =>
        {
            let message = <IMessage>JSON.parse(msg.toString());
            let client = this._clients[message.source.id];

            switch(message.type)
            {
                case MessageType.REGISTRATION:
                    this.registerClient(client);
                    break;
                case MessageType.LEAVE:
                    this.removeClient(client.id);
                    break;
                case MessageType.MESSAGE:
                    this.sendMessage(client.id, message.payload);
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
    shutdown(callback?: () => void): void
    {
        this._socket.close(callback);
        this._socket.on('close', () =>
        {
            this._socket = dgram.createSocket('udp4');
        })
    }

    /**
     * Add a client to the dictionary of connected clients.
     * It throws an error if the client is already registered.
     * @param client the client to register
     */
    private registerClient(client: IClient): void
    {
        if (client.id in this._clients)
            throw new Error(`client ${client.id} already registered`)
        this._clients[client.id] = client;
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
     * @param id the id of the receiver client
     * @param message the message to send
     */
    private sendMessage(id: number, message: string): void
    {
        let client = this._clients[id];

        // this._socket.setBroadcast(false); unsure but maybe it needs
        this._socket.send(message, client.address.port, client.address.ip);
    }
}