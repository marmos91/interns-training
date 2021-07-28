import * as dgram from 'dgram';
import { Address, IMessage, MessageType } from './Interfaces';

export default class Client
{
    private _socket: dgram.Socket;
    private _address: Address = {
        ip: 'localhost',
        port: 8000,
    };
    private _connected = false;

    constructor(private _id: number, private _username: string)
    {
        this._setup_client_socket();
    }

    connect(server?: Address): Promise<Address>
    {
        if (server)
            this._address = server;

        return Promise.resolve().then(() => {
            console.log(`[C:${this._id}] Registering client.`);
            return this._internal_send({
                type: MessageType.REGISTRATION,
            });
        })
        .then(() => {
            console.log(`[C:${this._id}] Connected.`);
            this._connected = true;
            return this._address;
        });
    }

    disconnect(): Promise<any>
    {
        if (!this._connected)
            return Promise.resolve();
        return new Promise<void>(resolve =>
        {
            this._internal_send({
                type: MessageType.LEAVE,
            })
            .finally(() =>
            {
                this._socket.close(() =>
                {
                    resolve();
                    this._setup_client_socket();
                });
            });
        });
    }

    send(message: string, to: number): Promise<any>
    {
        return this._internal_send({
            type: MessageType.MESSAGE,
            destination: to,
            payload: message,
        });
    }

    broadcast(message: string): Promise<any>
    {
        return this._internal_send({
            type: MessageType.BROADCAST,
            payload: message,
        });
    }

    private _setup_client_socket(): void
    {
        this._socket = dgram.createSocket('udp4');
        this._connected = false;
        this._socket.on('message', this._on_message.bind(this));
    }

    private _on_message(message: Buffer, remote_info: dgram.RemoteInfo): void
    {
        console.log(`[C:${this._id}] Got a message:\n${message}\n`);
    }

    private _internal_send(message: Omit<IMessage, 'source'>): Promise<void>
    {
        const source: IMessage['source'] = {
            id: this._id,
            username: this._username,
        };
        return new Promise<void>((resolve, reject) =>
        {
            const msg = JSON.stringify({
                type: message.type,
                source,
                destination: message.destination,
                payload: message.payload,
            });
            this._socket.send(msg, 0, msg.length, this._address.port, this._address.ip, (err, bytes) =>
            {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}