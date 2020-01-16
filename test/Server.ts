import {expect} from 'chai';
import * as dgram from 'dgram';
import * as sinon from 'sinon';

import {Client, Server} from '../src';
import {IMessage, MessageType} from '../src/Interfaces';

const default_port = 8000;

describe('Server', () =>
{
    let server: Server;
    let sandbox: sinon.SinonSandbox;

    before(() =>
    {
        server = new Server();
    });

    beforeEach(() =>
    {
        sandbox = sinon.createSandbox();
    });

    afterEach(() =>
    {
        sandbox.restore();
    });

    it('should listen on the default port if no parameters are passed to the listen method', (done) =>
    {
        let bind_spy = sandbox.spy(dgram.Socket.prototype, 'bind');

        server.listen((port) =>
        {
            expect(bind_spy.calledOnce).to.be.true;
            expect(port).to.equal(default_port);
            server.shutdown(done);
        });
    });

    it('should listen on the given port when specified', (done) =>
    {
        let bind_spy = sandbox.spy(dgram.Socket.prototype, 'bind');

        server.listen(7000, (port) =>
        {
            expect(bind_spy.calledOnce).to.be.true;
            expect(port).to.equal(7000);
            server.shutdown(done);
        });
    });

    it('should call the callback if a function is passed as the first listen parameter', (done) =>
    {
        server.listen(() =>
        {
            server.shutdown(done);
        });
    });

    it('should call the callback if a second parameter is passed to the listen function', (done) =>
    {
        server.listen(3000, () =>
        {
            server.shutdown(done);
        });
    });

    it('should setup all the dgram handlers', (done) =>
    {
        let socket_spy = sandbox.spy(dgram.Socket.prototype, 'on');

        server.listen(() =>
        {
            expect(socket_spy.callCount).to.be.equal(4);
            expect(socket_spy.calledWith('listening')).to.be.true;
            expect(socket_spy.calledWith('message')).to.be.true;
            expect(socket_spy.calledWith('error')).to.be.true;
            expect(socket_spy.calledWith('close')).to.be.true;

            server.shutdown(done);
        });
    });

    it('should correctly parse the serialized message', (done) =>
    {
        let client = new Client(1, 'test');
        let json_spy = sandbox.spy(JSON, 'parse');

        server.listen(() =>
        {
            let request = JSON.stringify({
                type: MessageType.REGISTRATION,
                source: {
                    id: 1,
                    username: 'test'
                }
            });

            client.connect().then(() =>
            {
                setTimeout(() =>
                {
                    expect(json_spy.calledOnce).to.be.true;
                    expect(json_spy.calledWith(request));

                    client.disconnect().then(() => server.shutdown(done));
                }, 500);
            }).catch((error) =>
            {
                if(error)
                    console.error(error);

                expect(error).to.be.undefined;

                client.disconnect().then(() => server.shutdown(done));
            });
        });
    });

    it('should correctly dispatch messages', (done) =>
    {
        let client1 = new Client(1, 'test');
        let client2 = new Client(2, 'test1');

        let send_spy = sandbox.spy(dgram.Socket.prototype, 'send');

        server.listen(() =>
        {
            client1.connect().then(() => client2.connect()).then(() =>
            {
                let request: IMessage = {
                    type: MessageType.MESSAGE,
                    source: {
                        id: 1,
                        username: 'test'
                    },
                    destination: 2,
                    payload: 'Hello'
                };
                return client1.send('Hello', 2).then(() =>
                {
                    expect(send_spy.called).to.be.true;
                    expect(send_spy.calledWithMatch(request.payload, sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any)).to.be.true;
                });
            }).then(() =>
            {
                return client1.disconnect().then(() => client2.disconnect()).then(() => server.shutdown(done));
            }).catch((error) =>
            {
                if(error)
                    console.error(error);

                expect(error).to.be.undefined;

                return client1.disconnect().then(() => client2.disconnect()).then(() => server.shutdown(done));
            });
        });
    });

    it('should correctly broadcast messages', (done) =>
    {
        let client1 = new Client(1, 'test');
        let client2 = new Client(2, 'test1');
        let client3 = new Client(3, 'test2');

        let send_spy = sandbox.spy(dgram.Socket.prototype, 'send');

        server.listen(() =>
        {
            client1.connect().then(() => client2.connect()).then(() => client3.connect()).then(() =>
            {
                return client1.broadcast('Hello').then(() =>
                {
                    return new Promise((resolve) =>
                    {
                        setTimeout(() =>
                        {
                            expect(send_spy.called).to.be.true;
                            expect(send_spy.withArgs('Hello', sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any).calledTwice).to.be.true;
                            resolve();
                        }, 500);
                    });
                });
            }).then(() =>
            {
                return client1.disconnect().then(() => client2.disconnect()).then(() => client3.disconnect()).then(() => server.shutdown(done));
            }).catch((error) =>
            {
                if(error)
                    console.error(error);

                expect(error).to.be.undefined;

                return client1.disconnect().then(() => client2.disconnect()).then(() => client3.disconnect()).then(() => server.shutdown(done));
            });
        });
    });

    it('should correctly un-register a client', (done) =>
    {
        let client1 = new Client(1, 'test');
        let client2 = new Client(2, 'test1');

        let json_spy = sandbox.spy(JSON, 'parse');

        server.listen(() =>
        {
            client1.connect().then(() => client2.connect()).then(() =>
            {
                let request1: IMessage = {
                    type: MessageType.LEAVE,
                    source: {
                        id: 1,
                        username: 'test'
                    }
                };

                let request2: IMessage = {
                    type: MessageType.LEAVE,
                    source: {
                        id: 2,
                        username: 'test1'
                    }
                };

                return client1.disconnect().then(() => client2.disconnect()).then(() =>
                {
                    expect(json_spy.calledWith(JSON.stringify(request1)));
                    expect(json_spy.calledWith(JSON.stringify(request2)));

                    server.shutdown(done);
                });
            }).catch((error) =>
            {
                if(error)
                    console.error(error);

                expect(error).to.be.undefined;

                return client1.disconnect().then(() => client2.disconnect()).then(() => server.shutdown(done));
            });
        });
    });
});