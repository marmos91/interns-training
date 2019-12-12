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
        this._socket = dgram.createSocket('udp4');
    }

    /**
     * Connects the client to the server. It returns a Promise which resolves with the server's address.
     * @param server specify the destination server ip and port. Defaults to {ip: 'localhost', port: 8000}
     */
    public connect(server: Address = {ip: 'localhost', port: 8000}): Promise<Address>
    {
        this._server = server;

        return new Promise((resolve) => this._socket.bind(this._server.port, this._server.ip, () =>
        {
            this._socket.on('message', (msg) => console.log(msg.toString()));

            const server_address = { ip: this._socket.address().address, port: this._socket.address().port};
            resolve(server_address);
        }));
    }

    /**
     * Disconnect the client from the server and instantiate another udp4 socket.
     */
    public disconnect(): Promise<any> {
        return new Promise((resolve, reject) => this._socket.close(() =>
        {
            this._socket = dgram.createSocket('udp4');
            resolve();
        }));
    }

    /**
     * Send a message to the server specifing the payload and the client's id the message is sent to.
     * @param message the actual message
     * @param to the client destination id
     */
    public send(message: string, to: number): Promise<any> {
        const letter = this._envelop(message, to);

        return new Promise((resolve, reject) =>
        {
            this._socket.send(Buffer.from(JSON.stringify(letter)), this._server.port, this._server.ip, (error) =>
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
        const letter = this._envelop(message);

        return new Promise((resolve, reject) =>
        {
            this._socket.send(Buffer.from(JSON.stringify(letter)), this._server.port, this._server.ip, (error) =>
            {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    }

    /**
     * _envelop creates the appropriate IMessage to be sent to the server.
     * @param message the message payload
     * @param to optional. The id of the client the message is sent to.
     */
    private _envelop(message: string, to?: number): IMessage
    {
        const letter: IMessage = {
            type: to ? MessageType.MESSAGE : MessageType.BROADCAST,
            source: {
                id: this._id,
                username: this._username
            },
            payload: message,
        };

        if (to)
            letter.destination = to;

        return letter;
    }
}