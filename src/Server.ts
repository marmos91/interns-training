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

        this._socket.on('error', (error) =>{
            console.log(`server error:\n${error.stack}`);
            this._socket.close();
        });

        this._socket.on('message', (msg, rinfo) =>
        {
            console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
            this._handle_incoming_message(msg, rinfo);
        });

        this._socket.on('listening', () => 
        {
            const address = this._socket.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });

        this._socket.bind(this._port);

        if(callback)
            callback(this._port);
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
                this._clients[message.source.id] = {
                    id: message.source.id,
                    username: message.source.username,
                    address: {
                        ip: rinfo.address,
                        port: rinfo.port
                    } 
                };
                break;
        }
    }
}
