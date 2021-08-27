import * as dgram from 'dgram';
import {IClient} from './Interfaces';
import {IMessage, MessageType} from './Interfaces';

export default class Server
{
    private _port: number;
    private readonly _port_default_number = 8000;
    private _socket: dgram.Socket;
    private _clients: {[id: number]: IClient} = {};

    public listen(config:{port?: number, callback?: (port: number) => void})
    {
        this._port = config.port ? config.port : this._port_default_number;
        this._socket = dgram.createSocket('udp4');

        this._socket.on('error', (error) =>
        {
            this._socket.close();
        });

        this._socket.on('message', (message,remote_info) =>
        {
            const received_message: IMessage = JSON.parse(message.toString());

            this._handle_incoming_message(received_message, remote_info);
        });

        this._socket.on('listening', () => 
        {
            console.log(`[SERVER] listening on port ${this._port}`);
        });

        this._socket.on('close', () => 
        {
            console.log("[SERVER] closed");
        });

        this._socket.bind(this._port);

        if(config.callback)
            config.callback(this._port);
    }

    public shutdown(callback?: () => void)
    {
        if(!this._socket)
            return;

        this._socket.close(() =>
        {
            if(callback)
                return callback();
        });
    }

    private _handle_incoming_message(message: IMessage, remote_info: dgram.RemoteInfo)
    {

        switch(message.type)
        {
            case MessageType.REGISTRATION:
                this._client_register(message, remote_info);
                break;

            case MessageType.LEAVE:
                this._client_leave(message);
                break;

            case MessageType.MESSAGE:
                this._client_message(message);
                break;

            case MessageType.BROADCAST:
                this._client_broadcast(message);
                break;
            
            default:
                break;

        }
    }

    private _client_register(message: IMessage, remote_info: dgram.RemoteInfo)
    {
        const {source: {id, username}} = message;

        if(this._clients[id])
            return;
        
        const {address: ip, port} = remote_info;

        this._clients[id] = {id, username, address: {ip, port}};
        console.log(this._clients);
    }

    private _client_leave(message: IMessage)
    {
        const {source : {id}} = message;

        this._clients[id] = undefined;
    }

    private _client_message(message: IMessage)
    {
        const {destination, payload} = message;

        this._send_message(payload, destination, message.source.id, message.source.username);
    }

    private _client_broadcast(message: IMessage)
    {
        const {source: {id, username}, payload} = message;

        const clients_to_send_broadcast = Object.keys(this._clients).filter((client) => Number(client) !== id);

        clients_to_send_broadcast.forEach((client_destination) => 
        {
            this._send_message(payload, Number(client_destination), message.source.id, message.source.username);
        });
    }

    private _send_message(payload: string, destination: number, source_id: number, source_username: string)
    {
        const client_destination = this._clients[destination];

        if(!client_destination)
        {
            console.log(`[SERVER] destination:${destination} not found`);
            return;
        }
        
        const message: IMessage = {
            type: MessageType.MESSAGE,
            source: {
                    id: source_id,
                    username: source_username
                },
            payload: payload
        };

        const encoded_message = JSON.stringify(message);

        this._socket.send(encoded_message, 0, encoded_message.length, client_destination.address.port, client_destination.address.ip, (error) => 
        {
            if(error)
                return error;
        });
    }
}
