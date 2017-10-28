import { Socket, AddressInfo, createSocket } from 'dgram';
import { IClient, IMessage, Address, MessageType } from './Interfaces';

export class Client
{
    private _id: number;
    private _username: string;
    private _socket: Socket;
    private _server: Address;

    public constructor(id: number, username: string) 
    {
        this._id = id;
        this._username = username;
        this._initSocket();
    }

    connect(server: Address = {ip: 'localhost', port: 8000}): Promise <Address>
    {
        this._server = server;
        this._socket.bind();
        let connectionRequest: Buffer = this._prepareBuffer(MessageType.REGISTRATION, undefined, undefined);
        return new Promise((resolve, reject) =>
        {
            this._socket.send(connectionRequest, this._server.port, this._server.ip, (error, bytes) =>
            {
                if (error) 
                    reject(error);
                resolve(this._server);
            });
        });
    }

    public disconnect(): Promise<any>
    {
        let serializedMessage: Buffer = this._prepareBuffer(MessageType.LEAVE, undefined, undefined);
        return new Promise((resolve, reject) =>
        {
            this._socket.send(serializedMessage, this._server.port, this._server.ip, (error, bytes) =>
            {
                if (error) 
                    reject(error);
                this._socket.close(() => 
                { 
                    this._initSocket(); 
                    resolve(); 
                });
            });
        });
    }

    public send(message: string, to: number): Promise<any>
    {
        let serializedMessage: Buffer = this._prepareBuffer(MessageType.MESSAGE, to, message);
        return new Promise((resolve, reject) =>
        {
            this._socket.send(serializedMessage, this._server.port, this._server.ip, (error, bytes) =>
            {
                if (error)
                    reject(error);
                resolve();
            });
        });
    }

    public broadcast(message: string): Promise<any>
    {
        let serializedMessage: Buffer = this._prepareBuffer(MessageType.BROADCAST, undefined, message);
        return new Promise((resolve, reject) =>
        {
            this._socket.send(serializedMessage, this._server.port, this._server.ip, (error, bytes) =>
            {
                if (error)
                    reject(error);
                resolve();
            });
        });
    }

    /**
     * Init the socket and prepare it to bind.
     */
    private _initSocket(): void
    {
        this._socket = createSocket('udp4');
        this._socket.on('message', (msg, rinfo) => 
        {
            let message: IMessage = JSON.parse(msg.toString('utf8'));
            console.log(`Message from ${message.source.username}:\n
                ${message.payload}\n`);
        });
        this._socket.on('error', (err) => 
        {
            console.log(err);
            this._socket.close();
        });
    }

    /**
     * Prepare an IMessage struct and serialize it with JSON.
     * @param type  Message type.
     * @param to    Receiver number.
     * @param text  Message text.
     * @returns     Serialized message struct.
     */
    private _prepareBuffer(type: MessageType, to: number, text: string): Buffer
    {
        let message: IMessage =
        {
            type: MessageType.MESSAGE,
            source: 
                {
                    id: this._id, 
                    username: this._username
                },
            destination: to,
            payload: text
        }
        return Buffer.from(JSON.stringify(message), 'utf8');
    }
}
