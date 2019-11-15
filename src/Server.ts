import {SocketType, createSocket, Socket, AddressInfo} from 'dgram';

import {IClient, Address, MessageType, IMessage} from './Interfaces';

import Client from './Client';


class Server 
{
        
    private static _deafult_port: number = 8000;
    private _port: number = Server._deafult_port;
    private _socket: Socket;
    private _clients: {[id: number] : IClient} = {};
   
    constructor()
    {
        this._port = Server._deafult_port;
        this._socket = createSocket('udp4');
        this._clients = {}
    }
    
    
    public listen(port?: number, callback?: (port: number) => void)
    {
        if(port !== undefined) 
        {
            this._port = port;
        }

        this._socket.on('error', this.on_error.bind(this));

        this._socket.on('close', this.on_close.bind(this));

        this._socket.on('message', this.on_message.bind(this));

        this._socket.bind({port: this._port}, () => callback(this._port));
    }

    shutdown()
    {
        this._socket.close(() =>
        {
            //fai una promise con resolve e reject in caso di errore
            this._socket = createSocket('udp4');
            this._clients = {};
        });
    };
    
    private on_close()
    {
        console.log('Server is close');
    }
    
    private on_error(error: Error)
    {
        console.error('An error occured, shutdown', Error);
        this.shutdown();
    }

    private on_message(msg: Buffer, _rinfo: AddressInfo)
    {   
        const _message: IMessage = Client.json_to_message(msg);
        const _address: Address = 
        {
            ip: _rinfo.address,
            port: _rinfo.port,
        };

        switch(_message.type)
        {
            case MessageType.REGISTRATION:
            {
                this._clients[_message.source.id] =
                {
                    id: _message.source.id,
                    username: _message.source.username,
                    address: 
                    {
                        ip: _address.ip,
                        port: _address.port
                    },
                }
                break;
            };
            case MessageType.LEAVE:
            {
                delete this._clients[_message.source.id];
                break;
            }
            case MessageType.MESSAGE:
            {
                const _ip = this._clients[_message.destination].address.ip;
                const _port = this._clients[_message.destination].address.port;
                this._socket.send(_message.payload, 0, _message.payload.length, _port,_ip );
                break;
            }
            case MessageType.BROADCAST:
            {
                const clients_to_send = Object.values(this._clients).filter(({id}) => id !== _message.source.id);
                for(let client of clients_to_send)
                {
                    const {ip, port} = client.address;
                    this._socket.send(_message.payload, 0, _message.payload.length, port, ip);
                }
                break;
            }
            default:
            {
                console.log('unknown message type!');
                break;
            }

        }
            
    }
    
}

export default Server;

