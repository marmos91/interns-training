import * as interfaces from "./Interfaces";
import * as dgram from 'dgram';

const defaultPort: number = 8000;

/**
 * Server class
 */
export default class Server
{
    private _port: number;
    private _socket: dgram.Socket;
    private _clients: { [id: number]: interfaces.IClient };

    /**
     * Server constructor creates socket and inizialises clients
     */
    public constructor()
    {
        this._socket = dgram.createSocket('udp4');
        this._clients = {};
    }

    /**
     * 
     * @param port the port to listen onto
     * @param callback the callback to be called
     */
    public listen(port?: number | ((port: number) => void), callback?: (port: number) => void)
    {
        this._socket.on('error', (err) =>
        {
            console.log(`server error:\n${err.stack}`);
            this._socket.close();
        });

        this._socket.on("message", (msg, rinfo) =>
        {
            this._on_message(msg, rinfo);
        });

        this._socket.on("listening", () =>
        {
            var address = this._socket.address();
            console.log("server listening " +
                address.address + ":" + address.port);
        });

        this._socket.on("close", () =>
        {
            console.log(' Stopping ...');
        });

        if (!port && !callback)
        {
            this._socket.bind(defaultPort);
        }
        else if (port && (typeof (port) === 'number') && !callback)
        {
            this._socket.bind(port);
        }
        else if (port && typeof (port) === 'function')
        {
            this._socket.bind(defaultPort);
            port(defaultPort);
        }
        else if (port && (typeof (port) === 'number') && callback && typeof (callback) === 'function')
        {
            this._socket.bind(port);
            callback(port);
        }
        else
        {
            throw new Error("Error: Ths type of argument was not expected");
        }
    }

    /**
     * 
     * @param callback 
     */
    public shutdown(callback?): void
    {
        this._socket.close();
        this._socket = dgram.createSocket('udp4');

        if (callback)
            callback();
    }
    
    private _on_message(msg: any, rinfo: any)
    {
        let imessage: interfaces.IMessage;
        imessage = JSON.parse(msg);
        var iclient: interfaces.IClient = {
            id: imessage.source.id,
            username: imessage.source.username,
            address: {
                ip: rinfo.address,
                port: rinfo.port
            }
        }

        switch (imessage.type)
        {
            case interfaces.MessageType.REGISTRATION:
                if (!this._clients[imessage.source.id])
                    this._clients[imessage.source.id] = iclient;
                break;

            case interfaces.MessageType.MESSAGE:
                if (this._clients[imessage.destination])
                {
                    this._socket.send(imessage.payload, this._clients[imessage.destination].address.port, this._clients[imessage.destination].address.ip, (err) =>
                    {
                        if (err)
                            throw new Error(err.message);
                    });
                }
                break;

            case interfaces.MessageType.LEAVE:
                if (this._clients[imessage.source.id])
                    delete this._clients[imessage.source.id];
                break;

            case interfaces.MessageType.BROADCAST:
                for (const key in this._clients)
                {
                    if (this._clients[key].id !== imessage.source.id)
                    {
                        this._socket.send(imessage.payload, 0, imessage.payload.length, this._clients[key].address.port, this._clients[key].address.ip, (err) =>
                        {
                            if (err)
                                throw new Error("send error");
                        });
                    }
                }
                break;

            default:
                throw new Error("Error: message type not expected");

        }
    }

}
