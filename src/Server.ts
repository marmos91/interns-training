import {SocketType, createSocket, Socket, AddressInfo} from 'dgram';

import {IClient, Address, MessageType, IMessage} from './Interfaces';

import Client from './Client';
import { prototype } from 'mocha';

const _default_port: number = 8000;   

class Server
{
    private _port: number = _default_port;
    private _socket: Socket;
    private _clients: {[id: number] : IClient} = {};

    public listen(configuration: {port: { port?: number | ((port: number) => void), number?: number | ((port: number) => void) , callback?: number | ((port: number) => void)}})
    {
        this._port = configuration.port.port && typeof configuration.port.port === 'number' ? configuration.port.port : _default_port;

        this._socket = createSocket('udp4');

        this._socket.on('close', this._on_close.bind(this));

        this._socket.on('error', this._on_error.bind(this));

        this._socket.on('message', this._on_message.bind(this));
    
        
        if (!configuration.port && !configuration.port.callback)
        {
            this._socket.bind(_default_port);
        }
        else if (configuration.port && typeof (configuration.port.port) === 'function')
        {
            const f = configuration.port.port! as any;
            this._socket.bind(_default_port, '0.0.0.0', () => f(_default_port));
        }
        else if (configuration.port && (typeof (configuration.port.port) === 'number') && configuration.port.callback && typeof (configuration.port.callback) === 'function')
        {
            const f = configuration.port.callback! as any;
            this._port = configuration.port.port as number;
            this._socket.bind(this._port, '0.0.0.0', () => f(this._port));

        }
        else if (configuration.port && (typeof (configuration.port.port) === 'number') && configuration.port.number && typeof (configuration.port.number) === 'function')
        {
            const f = configuration.port.number! as any;
            this._port = configuration.port.port as number;
            this._socket.bind(this._port, '0.0.0.0', () => f(this._port));
        }
        else
        {
            throw new Error("error");
        }
    };

    public shutdown(callback?: () => void)
    {
        this._clients = {};
        if(this._socket)
            return this._socket.close(callback);
        else 
            if(callback)
            {
                return callback();
            }

    };

    private _on_close()
    {
        console.log('Server is closed!');
    }

    private _on_error(error: Error)
    {
        console.error('An error occured!', error);
        this.shutdown();
    }

    private _on_message(msg: Buffer, rinfo: AddressInfo)
    {
        const message: IMessage = Client.json_to_msg(msg);
        const address: Address = 
        {
            ip: rinfo.address,
            port: rinfo.port,
        };
        
        switch (message.type)
        {
            case MessageType.REGISTRATION:
            {
                this._clients[message.source.id] = 
                {
                    id: message.source.id,
                    username: message.source.username,
                    address: 
                    {
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