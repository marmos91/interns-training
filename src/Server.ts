import * as dgram from 'dgram';
import { Socket } from 'dgram';
import { server } from 'sinon';
import {IClient} from './Interfaces';
import {IMessage, MessageType} from './Interfaces';

export default class Server
{
    private _port: number;
    private readonly _port_default_number = 8000;
    private _socket: dgram.Socket;
    private _clients: {[id: number]: IClient} = {};

    public listen(port?: number | ((port: number) => void), callback?: (port: number) => void)
    {
        this._port = port && typeof port === 'number' ? port : this._port_default_number;
        this._socket = dgram.createSocket('udp4');

        //TODO make more readable
        this._socket.on('error', (error) =>{
            // console.log(`server error:\n${error.stack}`);
            this._socket.close();
        });

        this._socket.on('message', (msg, rinfo) =>
        {
            // console.log(`server got message: ${msg} from ${rinfo.address}:${rinfo.port}`);
            this._handle_incoming_message(msg, rinfo);
        });

        this._socket.on('listening', () => 
        {
            const address = this._socket.address();
            // console.log(`server listening ${address.address}:${address.port}`);
        });

        this._socket.bind(this._port);

        if(typeof port === 'function')
        {
            // console.log('server: port === function')
            port(this._port);
        }            
        else if(callback)
        {
            callback(this._port);
        }
          

    }

    public shutdown(callback?: () => void)
    {
        //TODO: close the socket, instantiate a new one 
        //TODO: callback as close argument?
        if(this._socket)
            this._socket.close();
        
        this._clients = {};

        if(callback)
            return callback();
    }

    private _handle_incoming_message(msg: Buffer, rinfo: dgram.RemoteInfo)
    {
        const message: IMessage = JSON.parse(msg.toString());

        switch(message.type)
        {
            case MessageType.REGISTRATION:
                this._client_register(message, rinfo);
                break;

            case MessageType.LEAVE:
                this._client_leave(message);
                break;

            case MessageType.MESSAGE:
                this._client_message(message);
                break;

            case MessageType.BROADCAST:
                this._client_broadcast(message);
        }
    }

    private _client_register(message: IMessage, rinfo: dgram.RemoteInfo)
    {
        const {source: {id, username}} = message;

        if(this._clients[id])
            return;
        
        const {address, port} = rinfo;

        this._clients[id] = {
            id: id, 
            username: username, 
            address: {
                ip: address, 
                port: port
            }
        };
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
            console.log(`[SERVER] destination:${destination} not found`);
        
        const message: IMessage = {
            type: MessageType.MESSAGE,
            source: {
                    id: source_id,
                    username: source_username
                },
            payload: payload
        };

        const message_string = JSON.stringify(message);

        this._socket.send(message_string, 0, message_string.length, client_destination.address.port, client_destination.address.ip, (error) => 
        {
            if(error)
                return error;
            
            // console.log(`[SERVER]: message: ${payload} sent to client: ${client_destination.id}`);
        });
    }
}
