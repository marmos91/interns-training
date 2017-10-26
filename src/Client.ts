import { Socket } from 'dgram';
import { Address } from './Interfaces';

export default class Client {
    private _id: number;
    private _username: string;
    private _socket: Socket;
    private _server: Address;

    constructor(id: number, username: string) {
        this._id = id;
        this._username = username;
    }

    connect(server?: Address) : Promise<Address> {
        return new Promise((res, rej) => {
            res(server);
        });
    }

    disconnect() :  Promise<any> {
        return new Promise((res, rej) => {
            res();
        });
    }

    send(msg: string, to: number) : Promise<any> {
        return new Promise((res, rej) => {
            res();
        });
    }

    broadcast(msg: string) : Promise<any> {
        return new Promise((res, rej) => {
            res();
        })
    }
}
