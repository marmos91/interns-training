import { Socket, createSocket } from 'dgram';
import { IClient, IMessage, Address, MessageType } from './Interfaces';

export class Server 
{
    private static _DEFAULT_PORT: number = 8000;

    private _port: number;
    private _socket: Socket;
    private _clients: { [id: number]: IClient };

    public constructor() 
    {
        this._clients = {};
        this._initSocket();
    }

    public listen(port: number|((port: number) => void) = Server._DEFAULT_PORT, callback: (port: number) => void = null) 
    {
        let _callback: () => void = () => { };
        if (typeof port === 'number')
        {
            this._port = port;
            if (callback)
                _callback = () => { callback(this._port); };
        }
        else // port is a callback
        {
            if (callback)
                throw new TypeError("Bad method call: two callback functions passed.");
            this._port = Server._DEFAULT_PORT;
            _callback = () => { port(this._port); };
        }
        this._socket.bind(this._port, _callback);
    }

    public shutdown(callback: () => void = () => { }) 
    {
        this._socket.close();
        this._clients = {};
        this._initSocket();
        callback();
    }

    /**
     * Init the socket and prepare it to bind.
     */
    private _initSocket(): void
    {
        this._port = undefined;
        this._socket = createSocket('udp4');
        this._socket.on('error', (err) => 
        {
            console.log(`server error:\n${err.stack}`);
            this._socket.close();
        });
        this._socket.on('message', (msg, rinfo) => 
        {
            let message: IMessage = JSON.parse(msg.toString('utf8'));
            switch (message.type) 
            {
                case MessageType.REGISTRATION:
                    this._clients[message.source.id] = 
                    {
                        id: message.source.id,
                        username: message.source.username,
                        address: 
                        {
                            ip: rinfo.address,
                            port: rinfo.port
                        }
                    }
                    break;
                case MessageType.LEAVE:
                    delete this._clients[message.source.id]; 
                    break;
                case MessageType.MESSAGE:
                    if (this._clients[message.destination] == null)
                        break;
                    this._socket.send(message.payload,
                         this._clients[message.destination].address.port,
                         this._clients[message.destination].address.ip);
                    break;
                case MessageType.BROADCAST:
                    for (let index in this._clients)
                        this._socket.send(message.payload,
                            this._clients[index].address.port,
                            this._clients[index].address.ip);
                    break;
                default:
                    throw new TypeError("Invalid message type.");
            }
        });
    }
}