import {Socket, AddressInfo, createSocket} from 'dgram';
import {Address, IMessage, MessageType, IClient} from './Interfaces';
import * as Interfaces from './Interfaces';
import * as dgram from 'dgram';
const _default_server: Interfaces.Address = {
    ip: "localhost",
    port: 8000
};
class Client
{
    private _id: number;
    private _username: string;    
    private _socket: Socket;
    private _server: Address = _default_server;

    constructor( id: number, username: string)
    {
        this._id = id;
        this._username = username;
        this._socket = dgram.createSocket('udp4');
        this._server = _default_server;

    };

    async connect(server?: Address): Promise <Address>
    {
        if(server)
            this._server = server;
        else 
            this._server = _default_server;

        console.log('connected');
        await this._send_message_to_server(this._create_message(MessageType.REGISTRATION));
        
        return this._server;
    };

    public disconnect(): Promise <any>
    {  
        return new Promise<any>((resolve, reject) =>
        {
            let msg: Interfaces.IMessage = 
            {
                type: Interfaces.MessageType.LEAVE,
                source: {id: this._id, username: this._username}
            };

            try
            {
                this._socket.send(JSON.stringify(msg), this._server.port, this._server.ip, (err) => 
                {
                    if (err)
                        return reject(err);

                    this._socket.close();
                    this._socket = createSocket('udp4');
                    return resolve();
                });
            }
            catch(error)
            {
                return resolve();
            }
        });
    };

    public static json_to_msg(message: Buffer): IMessage
    {
        return JSON.parse(message.toString());
    };

    send(message: string, to: number): Promise <any>
    {
        console.log(`Client(${this._id}) is disconnected`, message, to);

        return this._send_message_to_server(this._create_message(MessageType.MESSAGE, message, to));
    };

    broadcast(message: string): Promise <any>
    {
        console.log(`Client(${this._id})'s sendind a broadcast message`, message);

        return this._send_message_to_server(this._create_message(MessageType.BROADCAST, message));
    };

    private _create_message(type: MessageType, payload?: string, destination?: number): IMessage
    {
        return{
            type,
            source:
            {
                id: this._id,
                username: this._username,
            },
            destination,
            payload,
        };
    };

    private _send_message_to_server(message: IMessage): Promise<any>
    {
        if(!this._socket)
            return;
        
        try
        {
            return new Promise((resolve, reject) =>
            {
                const msg = JSON.stringify(message);
                this._socket.send(
                    msg,
                    0,
                    msg.length,
                    this._server.port,
                    this._server.ip,
                    (error) => 
                    {
                        console.log(`Client(${this._id})::`, message, error);
                        
                        if(error)
                            return reject(error);
                        
                        return resolve();
                    }
                );
            });
        }
        catch(error)
        {
            return;
        }
    };
}

export default Client;