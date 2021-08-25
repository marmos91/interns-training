import * as dgram from 'dgram';
import {Address, IMessage, MessageType} from './Interfaces';

export default class Client
{
    private _id: number;
    private _username: string;
    private _socket: dgram.Socket;
    private _server: Address;
    private readonly _server_default_address: Address = {ip: 'localhost', port: 8000};

    constructor(id: number, username: string)
    {
        this._id = id;
        this._username = username;
        this._socket = dgram.createSocket('udp4');
    }

    public connect(server: Address = this._server_default_address): Promise <Address>
    {
        const register_message: IMessage = {
            type: MessageType.REGISTRATION,
            source: {
                id: this._id,
                username: this._username
            }
        };

        return new Promise((resolve, reject) => 
        {
           
        
        });
    }


}