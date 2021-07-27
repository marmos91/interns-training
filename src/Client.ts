import * as dgram from 'dgram';
import { Address, IMessage, MessageType } from './Interfaces';

export default class Client
{
    private _socket: dgram.Socket;
    private _address: Address = {
        ip: 'localhost',
        port: 8000,
    };

    constructor(private _id: number, private _username: string)
    {
        this._setup_client_socket();
    }

    connect(server?: Address): Promise<Address>
    {
        if (server)
            this._address = server;

        const {ip, port} = this._address;
        return new Promise<void>((resolve, reject) =>
        {
            this._socket.connect(port, ip, <() => void>((err: Error) =>
            {
                if (err)
                    return reject(err);

                resolve();
            }));
        })
        .then(() => {
            console.log(`[C:${this._id}] Registering client.`);
            return this._internal_send({
                type: MessageType.REGISTRATION,
            });
        })
        .then(() => {
            console.log(`[C:${this._id}] Connected.`);
            return this._address;
        });
    }

    disconnect(): Promise<any>
    {
        return this._internal_send({
            type: MessageType.LEAVE,
        })
        .then(() =>
        {
            this._socket.disconnect();
            this._socket.close(() =>
            {
                this._setup_client_socket();
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
            this._socket.send(JSON.stringify({
                source,
                ...message,
            }), (err, bytes) =>
            {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}