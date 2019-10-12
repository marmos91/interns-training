import {Socket, AddressInfo, createSocket} from 'dgram';

import {Address, IMessage, MessageType} from './Interfaces';

class Client
{
    private static _default_server: Address = {ip: 'localhost', port: 8000};
    
    private _socket: Socket;
    private _server: Address = Client._default_server;

    constructor(private _id: number, private _username: string)
    {
        this.reset();
    };

    async connect(server?: Address): Promise <Address>
    {
        if(server)
            this._server = server;

        console.log(`Client(${this._id})::connect`, this._server);
        
        await this.send_message_to_server(this.create_message(MessageType.REGISTRATION));

        return this._server;
    };

    async disconnect(): Promise <any>
    {
        console.log(`Client(${this._id})::disconnect`);
        
        await this.send_message_to_server(this.create_message(MessageType.LEAVE));

        return this.reset();
    };

    send(message: string, to: number): Promise <any>
    {
        console.log(`Client(${this._id})::disconnect`, message, to);

        return this.send_message_to_server(this.create_message(MessageType.MESSAGE, message, to));
    };

    broadcast(message: string): Promise <any>
    {
        console.log(`Client(${this._id})::broadcast`, message);

        return this.send_message_to_server(this.create_message(MessageType.BROADCAST, message));
    };

    private reset()
    {
        this._server = Client._default_server;
        this._socket = createSocket('udp4');

        this._socket.on('message', (msg: Buffer, rinfo: AddressInfo) =>
        {
            console.log(`Client(${this._id})::message`, this._id, msg.toString());
        });
    };

    private create_message(type: MessageType, payload?: string, destination?: number): IMessage
    {
        return {
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

    private send_message_to_server(message: IMessage): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            const msg = Client.serialize_message(message);
            this._socket.send(
                msg,
                0,
                msg.length,
                this._server.port,
                this._server.ip,
                (error) => 
                {
                    console.log(`Client(${this._id})::send_message_to_server`, message, error);
                    
                    if(error)
                        return reject(error);
                    
                    return resolve();
                },
            );
        });
    };

    private static serialize_message(message: IMessage): string
    {
        return JSON.stringify(message);
    };

    public static deserialize_message(message: Buffer): IMessage
    {
        return JSON.parse(message.toString());
    };
}

export default Client;