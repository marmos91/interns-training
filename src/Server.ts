import * as dgram from 'dgram';

import {IClient, IMessage, MessageType} from './Interfaces';

export default class Server 
{
    _port: number = 8000;
    _address: string = 'localhost';
    _socket: dgram.Socket;
    _clients: { [id: number]: IClient; } = {};

    constructor()
    {
        this._read_message = this._read_message.bind(this);
    }

    listen(port?: number | ((port: number) => void), callback?: (port: number) => void)
    {
        console.log('called listen');
        if(port && typeof port === 'number')
            this._port = port;

        if(port && port instanceof Function)
        {
            callback = port;
            this._port = 8000;
        }

        this._socket = dgram.createSocket('udp4');

        this._socket.on('listening', () => console.log(`listening on ${this._port}`));

        this._socket.on('message', this._read_message);

        this._socket.on('error', (err) =>
        {
            console.log(`server error:\n${err.stack}`);
            this._socket.close();
        });

        this._socket.on('close', () => console.log('socket closed'));
        this._socket.bind(this._port, this._address);

        if(callback)
            callback(this._port);
    }

    shutdown(callback?: () => void) 
    {
        console.log('called shutdown');

        if(typeof this._socket === 'undefined')
            return callback ? callback() : null;

        this._socket.close(callback);
    }

    private _read_message(msg: Buffer, rinfo: dgram.AddressInfo) 
    {
        console.log('reading message');
        let message: IMessage;
        try
        {
            message = <IMessage>JSON.parse(msg.toString());
        } catch(error)
        {
            return;
        }

        if(message.type === MessageType.REGISTRATION)
        {
            console.log('registration request');

            let client: IClient = {
                address: {
                    ip: rinfo.address,
                    port: rinfo.port
                },
                id: message.source.id,
                username: message.source.username
            }
            this._clients[message.source.id] = client;
            console.log(`user ${message.source.id} registered`);

        }

        if(message.type === MessageType.LEAVE)
        {
            console.log('leave request');

            if(message.source.id in this._clients)
                delete this._clients[message.source.id];
        }

        if(message.type === MessageType.MESSAGE)
        {
            console.log('message received from server');
            console.log(message.payload);

            if(message.payload && message.destination)
            {
                this._socket.send(message.payload, 0, message.payload.length, message.destination,
                    this._clients[message.destination].address.ip);
                console.log('message forwarded');
            }

        }

        if(message.type == MessageType.BROADCAST)
        {
            for(const id in this._clients)
            {
                const client: IClient = this._clients[id];

                if(client.id != message.source.id)
                    this._socket.send(message.payload, 0, message.payload.length, client.address.port, client.address.ip)
            }
        }
    }
}