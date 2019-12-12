import * as dgram from 'dgram';
import { Address, IMessage, MessageType } from './Interfaces';

export default class Client
{
    private _id: number;
    private _username: string;
    private _socket: dgram.Socket;
    private _server: Address;

    constructor(id: number, username: string)
    {
        this._id = id;
        this._username = username;
        this._socket = dgram.createSocket({type: 'udp4'});
    }

    /**
     * Send a registration message to the server. It returns a Promise which resolves with the server's address.
     * @param server specify the destination server ip and port. Defaults to {ip: 'localhost', port: 8000}
     */
    public connect(server: Address = {ip: 'localhost', port: 8000}): Promise<Address>
    {
        this._server = server;

        const registration_message = <IMessage> {
            type: MessageType.REGISTRATION,
            destination: this._server.port,
            source: {id: this._id, username: this._username}
        };

        const buf = Buffer.from(JSON.stringify(registration_message));

        return new Promise((resolve) => this._socket.send(buf, this._server.port, this._server.ip, () =>
        {
            this._socket.on('message', (msg) => console.log(`${this._username}) ${msg.toString()}`));
            resolve(server);
        }));
    }

    /**
     * Disconnect the client from the server and instantiate another udp4 socket.
     */
    public disconnect(): Promise<any> {

        const leave_message = <IMessage> {
            type: MessageType.LEAVE,
            destination: this._server.port,
            source: {id: this._id, username: this._username}
        };
        
        return new Promise((resolve) => this._socket.send(Buffer.from(JSON.stringify(leave_message)), this._server.port, this._server.ip, () =>
        {
            this._socket.close(() =>
            {
                this._socket = dgram.createSocket('udp4');
                resolve();
            });
        }));
    }

    /**
     * Send a message to the server specifing the payload and the client's id the message is sent to.
     * @param message the actual message
     * @param to the client destination id
     */
    public send(message: string, to: number): Promise<any> {
        const msg = <IMessage>{
            type: MessageType.MESSAGE,
            source: {
                id: this._id,
                username: this._username
            },
            payload: message,
            destination: to
        };

        return new Promise((resolve, reject) =>
        {
            this._socket.send(Buffer.from(JSON.stringify(msg)), this._server.port, this._server.ip, (error) =>
            {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    }

    /**
     * Broadcast a message to the server.
     * @param message the message payload
     */
    public broadcast(message: string): Promise<any> {
        const broadcast_message = <IMessage>{
            type: MessageType.BROADCAST,
            source: {
                id: this._id,
                username: this._username
            },
            payload: message,
        };

        return new Promise((resolve, reject) =>
        {
            this._socket.send(Buffer.from(JSON.stringify(broadcast_message)), this._server.port, this._server.ip, (error) =>
            {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    }
}