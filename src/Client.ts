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

    public constructor(private _id: number, private _username: string, private _show_log = false)
    {
        this._setup_client_socket();
    }

    public async connect(server?: Address): Promise<Address>
    {
        if (server)
            this._address = server;

        if (this._show_log)
            console.log(`[C:${this._id}] Registering client.`);

        await this._internal_send({
            type: MessageType.REGISTRATION,
        });

        if (this._show_log)
            console.log(`[C:${this._id}] Connected.`);

        this._connected = true;

        return this._address;
    }

    public async disconnect(): Promise<any>
    {
        if (!this._connected)
            return;

        try
        {
            await this._internal_send({
                type: MessageType.LEAVE,
            });
        }
        catch
        {
            // NOOP
        }
        finally
        {
            await this._internal_socket_close();
            this._setup_client_socket();
        }
    }

    public send(message: string, to: number): Promise<any>
    {
        return this._internal_send({
            type: MessageType.MESSAGE,
            destination: to,
            payload: message,
        });
    }

    public broadcast(message: string): Promise<any>
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
        if (this._show_log)
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

    private _internal_socket_close(): Promise<void>
    {
        return new Promise<void>(resolve =>
        {
            this._socket.close(() =>
            {
                resolve();
            });
        });
    }
}