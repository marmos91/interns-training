import * as interfaces from "./Interfaces";
import * as dgram from 'dgram';

const defaultServer: interfaces.Address = {
    ip: "localhost",
    port: 8000
};
/**
 * Client class
 */
export default class Client
{
    private _id: number;
    private _username: string;
    private _socket: dgram.Socket;
    private _server: interfaces.Address;

    public constructor(id: number, username: string)
    {
        this._id = id;
        this._username = username;
        this._socket = dgram.createSocket('udp4');
        this._server = defaultServer;
    }

    public connect(server?: interfaces.Address): Promise<interfaces.Address>
    {
        if (server)
            this._server = server;

        return new Promise<interfaces.Address>((resolve, reject) =>
        {
            this._socket.bind(() => 
            {
                this._socket.on('message', (msg, rinfo) =>
                {
                    console.log(`client ${this._id} got: ${msg} from ${rinfo.address}:${rinfo.port}`);
                });

                let imessage: interfaces.IMessage = {
                    type: interfaces.MessageType.REGISTRATION,
                    source: {
                        id: this._id,
                        username: this._username
                    }
                };

                this._send(imessage, (error, bytes) => 
                {
                    if(error)
                        return reject(error);

                    return resolve(this._server);
                });
            });
            
            //TODO factorize code
            // if (!server)
            // {
            //     let address: interfaces.Address = {
            //         ip: "localhost",
            //         port: 8000
            //     }
            //     const  msg:string =JSON.stringify(imessage);
            //     this._server = address;
            //     this._socket.send(msg, 0, msg.length, this._server.port, this._server.ip, (err) =>
            //     {
            //         if (err)
            //             return reject(new Error("send error 1"));
            //         if (!err)
            //             return resolve(this._server);
            //     });

            // }
           
        });//promise
    }

    private _send(request: interfaces.IMessage, callback: (error: Error, bytes: number) => void)
    {
        try
        {
            const msg: string = JSON.stringify(request);
            this._socket.send(msg, 0, msg.length, this._server.port, this._server.ip, callback);
        }
        catch(error)
        {
            console.error(error);
        }
    }


    public disconnect(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {

            const imessage: interfaces.IMessage = {
                type: interfaces.MessageType.LEAVE,
                source: {
                    id: this._id,
                    username: this._username
                }
            }

            this._send(imessage, () =>
            {
                this._socket.close();
                this._socket = dgram.createSocket('udp4');
            
                return resolve();
            });
            
            // if (!this._socket)
            //     return reject(new Error("Error in disconnect()"));
            // else
            // return resolve();
        });
    }

    public send(message: string, to: number): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            const imessage: interfaces.IMessage = {
                type: interfaces.MessageType.MESSAGE,
                source: {
                    id: this._id,
                    username: this._username,
                },
                destination: to,
                payload: message
            }
            const msg: string = JSON.stringify(imessage);
            this._socket.send(msg, 0, msg.length, this._server.port, this._server.ip, (err) =>
            {
                if (err)
                    return reject(new Error("send error 4"));
                if (!err)
                    return resolve();

            });
        });
    }

    broadcast(message: string): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            const imessage: interfaces.IMessage = {
                type: interfaces.MessageType.BROADCAST,
                source: {
                    id: this._id,
                    username: this._username,
                },
                payload: message
            }
            const msg: string = JSON.stringify(imessage);
            this._socket.send(msg, 0, msg.length, this._server.port, this._server.ip, (err) =>
            {
                if (err)
                    return reject(new Error("send error 5"));
                if (!err)
                    return resolve();
            });
        });
    }
}

//TODO method send privata...poi tutti chiamano quella per inviare, fa la json... lei


//default fuori