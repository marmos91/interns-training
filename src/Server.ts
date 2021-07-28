import { IClient, IMessage, MessageType } from './Interfaces';
import * as dgram from 'dgram';

export default class Server
{
    private _port: number = 8000;
    private _socket: dgram.Socket;
    private _clients: {
        [id: number]: IClient;
    } = {};
    private _bound = false;

    constructor()
    {
        this._setup_server();
    }

    listen(port?: number): void;
    listen(callback?: (port: number) => void): void;
    listen(port: number, callback?: (port: number) => void): void;
    listen(port_or_callback?: number | ((port: number) => void), callback?: (port: number) => void): void
    {
        let cb: typeof callback;
        this._port = 8000;
        if (port_or_callback) {
            if (typeof port_or_callback === 'function') {
                cb = port_or_callback;
            } else if (typeof port_or_callback === 'number') {
                this._port = port_or_callback;
                cb = callback;
            }
        }

        this._socket.on('error', this._on_server_error.bind(this));
        this._socket.on('message', this._on_server_message.bind(this));
        this._socket.on('close', () => {
            this._clients = {};
        });
        if (cb)
        {
            this._socket.on('listening', () =>
            {
                cb(this._port);
            });
        }

        this._bound = true;
        this._socket.bind(this._port);
    }

    shutdown(callback?: () => void): void {
        if (!this._bound && callback)
            return callback();
        this._socket.close(() =>
        {
            this._setup_server();
            if (callback)
                callback();
        });
    }

    private _setup_server()
    {
        this._socket = dgram.createSocket('udp4');
        this._bound = false;
    }

    private _on_server_error(error: Error): void
    {
        console.log(`Server error:\n ${error.stack}`);
        this._socket.close();
    }

    private _on_server_message(message: Buffer, remote_info: dgram.RemoteInfo): void
    {
        let parsed_message: IMessage;
        try
        {
            parsed_message = JSON.parse(message.toString());
        } catch
        {
            console.error(`Could not parse message ${message}. Not JSON.`)
        }
        try
        {
            switch (parsed_message.type)
            {
                case MessageType.REGISTRATION:
                    {
                        const id = this._get_id_from_message(parsed_message);
                        const username = this._get_username_from_message(parsed_message);
                        
                        const client: IClient = {
                            address: {
                                ip: remote_info.address,
                                port: remote_info.port
                            },
                            id,
                            username,
                        };
                        this._clients[id] = client;
                        console.log(`[S] Registered new client "${id}:${username}".`);
                    }
                    break;
                case MessageType.LEAVE:
                    {
                        const id = this._get_id_from_message(parsed_message);
                        if (!(id in this._clients))
                            throw new Error(`Client not registered.`);
                        delete this._clients[id];
                    }
                    break;
                case MessageType.MESSAGE:
                    {
                        const destination_id = this._get_destination_id_from_message(parsed_message);
                        const payload = this._get_payload_from_message(parsed_message);

                        const client = this._clients[destination_id];
                        if (!client)
                            throw new Error(`Destination not registered.`);

                        this._socket.send(payload, client.address.port, client.address.ip);
                    }
                    break;
                case MessageType.BROADCAST:
                    {
                        const id = this._get_id_from_message(parsed_message);
                        const payload = this._get_payload_from_message(parsed_message);

                        for (const client of Object.values(this._clients))
                        {
                            if (client.id === id)
                                continue;
                            this._socket.send(payload, 0, payload.length, client.address.port, client.address.ip);
                        }
                    }
                    break;
            }
        } catch (err)
        {
            console.error(`Could not parse message ${message}. Protocol error: \n${err}`);
        }
    }

    private _get_id_from_message(message: IMessage): number
    {
        const id = message.source?.id;
        if (id === undefined)
            throw new Error(`source.id not defined`);
        return id;
    }

    private _get_username_from_message(message: IMessage): string
    {
        const username = message.source?.username;
        if (username === undefined)
            throw new Error(`source.username not defined`);
        return username;
    }

    private _get_destination_id_from_message(message: IMessage): number
    {
        const id = message.destination;
        if (id === undefined)
            throw new Error(`destination not defined`);
        return id;
    }

    private _get_payload_from_message(message: IMessage): string
    {
        const payload = message.payload;
        if (payload === undefined)
            throw new Error(`payload not defined`);
        return payload;
    }
}