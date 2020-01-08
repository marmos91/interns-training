import {Socket, createSocket} from 'dgram';
import {IClient, IMessage, MessageType, Address} from './Interfaces';

export default class Server {
    private _default_port = 8000;
    private _default_address = '0.0.0.0';
    private _port: number;
    private _socket: Socket;
    private _clients: {[id: number] : IClient}

    constructor()
    {
        
    }

    listen(port?: number | ((port: number) => void), callback?: (port: number) => void) : void 
    {
        this._clients = {};
        callback = port instanceof Function ? port : callback;
        this._port = port instanceof Function ? this._default_port : port;
        this._socket = createSocket('udp4');

        this._socket.bind(this._port, this._default_address);

        this._socket.on('error', (error) => 
        {
            throw new Error(error.message);
        });

        this._socket.on('listening', () => 
        {
            callback(this._port);
        });

        this._socket.on('close', () => {});

        this._socket.on('message', (message) => 
        {
            let message_received: IMessage;
            try {
                message_received = JSON.parse(message.toString());
            } catch (e) {
                return;
            }

            switch(message_received.type) {
                case MessageType.REGISTRATION:
                    this._register_client(message_received.source.id, message_received.source.username);
                    break;

                case MessageType.LEAVE:
                    this._leave_client(message_received.source.id);
                    break;

                case MessageType.MESSAGE:
                    if(message_received.destination == null)
                        throw new Error("Destination client not specified - abort");

                    const destination: Address = this._clients[message_received.destination].address;
                    this._send_message(destination, message_received.payload);
                    break;
        
                case MessageType.BROADCAST:
                    const broadcast_msg: IMessage = {
                        type: MessageType.MESSAGE,
                        source: message_received.source,
                        payload: message_received.payload
                    };

                    this._broadcast_message(broadcast_msg);
                    break;

                default:
                    throw new Error("Unknown type!");
            }
        });
    }

    shutdown(callback?: () => void) 
    {
        if (this._socket == null) 
            return callback ? callback() : null;
        
        this._socket.close(callback);
    }

    private _register_client(id: number, username: string): void
    {
        // Check if client already exist
        if(id in this._clients)
            throw new Error(`Client ${id} already exist`);

        this._clients[id] = {
            id,
            username,
            address: {
                ip: 'localhost',
                port: this._port
            }
        };
    }

    private _leave_client(id: number): void
    {
        if(!(id in this._clients))
            throw new Error(`Client ${id} not registered`);

        delete this._clients[id];
    }

    private _send_message(destination: Address, message: string): void
    {
        const buffer: string = message;//JSON.stringify(message);

        this._socket.send(buffer, 0, buffer.length, destination.port, destination.ip, (error) =>
        {
            if(error) 
                throw new Error(error.message);
        });
    }

    private _broadcast_message(message: IMessage): void
    {
        for(const client_id in this._clients) 
        {
            const client: IClient = this._clients[client_id];
            
            if (message.source.id == client.id) continue;
            
            message.destination = client.id;

            this._send_message(client.address, message.payload);
        }
    }
}
