import * as interfaces from "./Interfaces";
import * as dgram from 'dgram';

/**
 * default ip, port settings
 */
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
    /**
     * 
     * @param id the client's id
     * @param username the client's username
     */
    public constructor(id: number, username: string)
    {
        this._id = id;
        this._username = username;
        this._socket = dgram.createSocket('udp4');
        this._server = defaultServer;
    }
    /**
     * @param server the server[ip, port] to use, optional
     * if omitted default ip, port will be used
     */
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
                    if (error)
                        return reject(error);

                    return resolve(this._server);
                });
            });
        });
    }

    /**
     * disconnects client from server and opens a new socket
     */
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
        });
    }
    /**
     * sends message to a specific client
     * @param message payload of the message to send
     * @param to the id of the client to send the message to
     */
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
            try
            {
                const msg: string = JSON.stringify(imessage);
                this._socket.send(msg, 0, msg.length, this._server.port, this._server.ip, (err) =>
                {
                    if (err)
                        return reject(err);
                    if (!err)
                        return resolve();

                });
            }
            catch (error)
            {
                throw new Error(error);
            }
        });
    }
    /**
     * sends message to all the clients connected to the server
     * @param message the payload of the message to send
     */
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
                    return reject(new Error(err.message));
                if (!err)
                    return resolve();
            });
        });
    }

    /**
 * private method used to send messages to server
 * @param request the message to send
 * @param callback 
 */
    private _send(request: interfaces.IMessage, callback: (error: Error, bytes: number) => void)
    {
        try
        {
            const msg: string = JSON.stringify(request);
            this._socket.send(msg, 0, msg.length, this._server.port, this._server.ip, callback);
        }
        catch (error)
        {
            throw new Error(error);
        }
    }

}