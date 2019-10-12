import {SocketType, createSocket, Socket, AddressInfo} from 'dgram';

import {IClient, Address, MessageType, IMessage} from './Interfaces';

import Client from './Client';

type ServerListenCallback = (port: number) => void;

class Server
{
    private static _default_port: number = 8000;
    
    private _port: number = Server._default_port;
    private _socket: Socket;
    private _clients: {[id: number] : IClient} = {};

    listen(port?: number | ServerListenCallback, callback?: ServerListenCallback)
    {
        this._port = port && typeof port === 'number' ? port : Server._default_port;

        this._socket = createSocket('udp4');

        this._socket.on('close', this.on_close.bind(this));

        this._socket.on('error', this.on_error.bind(this));

        this._socket.on('message', this.on_message.bind(this));

        this._socket.on('listening', () =>
        {
            console.log('Server::listening', this._port);
            
            if(callback)
                return callback(this._port);

            if(port && typeof port === 'function')
                return port(this._port);
        });
        
        this._socket.bind(this._port);
    };

    shutdown(callback?: () => void)
    {
        this._clients = {};

        if(this._socket)
            return this._socket.close(callback);

        if(callback)
            return callback();
    };

    private on_close()
    {
        console.log('Server::closed');
    }

    private on_error(error: Error)
    {
        console.error('Server::error', error);
        this.shutdown();
    }

    private on_message(msg: Buffer, rinfo: AddressInfo)
    {
        const message: IMessage = Client.deserialize_message(msg);
        const address: Address = {
            ip: rinfo.address,
            port: rinfo.port,
        };
        
        console.log('Server::message', message, address);

        switch (message.type)
        {
            case MessageType.REGISTRATION:
            {
                this._clients[message.source.id] = {
                    id: message.source.id,
                    username: message.source.username,
                    address: {
                        ip: address.ip,
                        port: address.port,
                    },
                };
                break;
            }

            case MessageType.LEAVE:
            {
                delete this._clients[message.source.id];
                break;
            }
            
            case MessageType.MESSAGE:
            {
                const {ip, port} = this._clients[message.destination].address;
                this._socket.send(message.payload, 0, message.payload.length, port, ip);
                break;
            }
            
            case MessageType.BROADCAST:
            {
                const clients_to_send = Object.values(this._clients).filter(({id}) => id !== message.source.id);
                for(let client of clients_to_send)
                {
                    const {ip, port} = client.address;
                    this._socket.send(message.payload, 0, message.payload.length, port, ip);
                }
                break;
            }
            default:
                console.error(`Unknown message of type ${message.type}`);
                break;
        }
    }
}

export default Server;