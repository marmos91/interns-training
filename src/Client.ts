import {Socket, createSocket, AddressInfo} from 'dgram';
import {Address, IMessage, MessageType} from './Interfaces';

export default class Client 
{
    private _id: number;
    private _username: string;
    private _socket: Socket;
    private _server: Address;
    private _default_server: Address = {ip: 'localhost', port: 8000};
    private _source;

    constructor(id: number, username: string) 
    {
        this._id = id;
        this._username = username;
        this._source =  {id, username};
    }

    connect(server?: Address): Promise<Address> 
    {
        return new Promise((resolve, reject) =>
        {
            this._server = server == null ? this._default_server : server;

            this._socket = createSocket('udp4');
            
            this._socket.on('listening', () => {});

            this._socket.on('message', (msg: Buffer, rinfo: AddressInfo) => {
                console.log(msg.toString());
            });
                
            const registration_message: IMessage = {
                type: MessageType.REGISTRATION,
                source: {
                    id: this._id,
                    username: this._username
                }
            };

            this._send_message(registration_message).then(() => 
            {
                resolve(this._server);
            });
        });
    }

    disconnect(): Promise<any> 
    {
        const message: IMessage = {
            type: MessageType.LEAVE,
            source: this._source
        };

        return this._send_message(message, () => 
        {
            this._socket.close();
            this._socket = createSocket('udp4');
        });
    }

    send(msg: string, to: number): Promise<any> 
    {
        const message: IMessage = {
            type: MessageType.MESSAGE,
            source: this._source,
            destination: to,
            payload: msg
        };

        return this._send_message(message);
    }

    broadcast(msg: string): Promise<any>
    {
        const message: IMessage = {
            type: MessageType.BROADCAST,
            source: this._source,
            payload: msg
        };

        return this._send_message(message);
    }

    private _send_message(message: IMessage, callback?) 
    {
        return new Promise<any>((resolve, reject) => {
            let buffer: string = JSON.stringify(message);

            this._socket.send(buffer, 0, buffer.length, this._server.port, this._server.ip, (error) =>
            {
                if(error) 
                    reject(error.message);

                if(callback)
                    callback();

                resolve();
            });
        });
    }
}
