import * as dgram from 'dgram';
import {resolve} from 'url';

import {Address, IMessage, MessageType} from './Interfaces';

export default class Client 
{
    _id: number;
    _username: string;
    _socket: dgram.Socket;
    _server: Address;

    constructor(id: number, username: string) 
    {
        this._id = id;
        this._username = username;
        this._socket = dgram.createSocket("udp4");

        this._socket.on('message', (msg, rinfo) => console.log(`message received: ${msg}`));
    }

    connect = (server: Address = { ip: 'localhost', port: 8000 }): Promise<Address> => 
    {
        this._server = server;
        return this._send_message(MessageType.REGISTRATION).then(() => server)
            .catch(err => { throw new Error; });
    }

    disconnect = (): Promise<void> => 
    {
        return new Promise((resolve, reject) =>
        {
            this._send_message(MessageType.LEAVE);
            this._socket.close();
            this._socket = dgram.createSocket('udp4');
            return resolve();
        });
    }

    send = (message: string, to: number): Promise<void> => 
    {
        return this._send_message(MessageType.MESSAGE, message, to);
    }

    broadcast = (message: string): Promise<void> =>
    {
        return this._send_message(MessageType.BROADCAST, message);
    }

    private _send_message = (type: MessageType, message?: string, to?: number): Promise<void> => 
    {
        console.log(`sending message ${MessageType[type]}`);
        return new Promise((resolve, reject) =>
        {
            const to_send: IMessage = {
                type: type,
                source: {
                    id: this._id,
                    username: this._username
                },
                destination: to,
                payload: message,
            }
            const payload: string = JSON.stringify(to_send);

            this._socket.send(payload, 0, payload.length, this._server.port, this._server.ip, (error) =>
            {
                if(error)
                    return reject(error.message)

                return resolve();
            });
        });
    }
}