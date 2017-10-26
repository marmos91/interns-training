import { Socket, createSocket } from 'dgram';
import { IClient } from './Interfaces';

export default class Server {
    private _port: number;
    private _socket: Socket;
    private _clients: {[id: number] : IClient}

    listen(port?: number | ((port: number) => void), callback?: (port: number) => void) : void {
        this._socket = createSocket('udp4');

    }

    shutdown(callback?: () => void) {

    }
}
