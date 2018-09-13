import {expect} from 'chai';
import * as dgram from 'dgram';
import * as sinon from 'sinon';
import {Client, Server} from '../src/index';
import {Address, IMessage, MessageType} from '../src/Interfaces';

const server_endpoint_default = {
    ip: 'localhost',
    port: 8000
};

describe('Client', () =>
{
    let server: Server;
    let client: Client;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() =>
    {
        sandbox = sinon.createSandbox();
        server = new Server();
        client = new Client(1, 'test');
    });

    afterEach((done) =>
    {
        sandbox.restore();
        client.disconnect().then(() => server.shutdown(done)).catch(() => server.shutdown(done));
    });

    it('should connect to the default server if no parameters are specified', (done) =>
    {
        client.connect().then((connected_server: Address) =>
        {
            expect(connected_server).to.be.deep.equal(server_endpoint_default);
            return client.disconnect().then(() => server.shutdown(done));
        }).catch((error) =>
        {
            if (error)
                console.error(error);

            expect(error).to.be.undefined;

            server.shutdown(done);
        });
    });

    it('should connect to the given server if a parameter is specified', (done) =>
    {
        let dgram_stub = sandbox.stub(dgram.Socket.prototype, 'send').yields(null, 10);

        client.connect({ip: 'api.server.net', port: 8888}).then((connected_server: Address) =>
        {
            expect(dgram_stub.calledWith(sinon.match.any, 8888, 'api.server.net')).to.be.true;
            expect(connected_server).to.be.deep.equal({ip: 'api.server.net', port: 8888});
        }).then(() => server.shutdown(done)).catch((error) =>
        {
            if (error)
                console.error(error);

            expect(error).to.be.undefined;

            server.shutdown(done);
        });
    });

    it('should disconnect from the server', (done) =>
    {
        let dgram_stub = sandbox.stub(dgram.Socket.prototype, 'send').yields(null, 10);
        let close_stub = sandbox.spy(dgram.Socket.prototype, 'close');

        let request: IMessage = {
            type: MessageType.LEAVE,
            source: {
                id: 1,
                username: 'test'
            }
        };

        client.connect().then(() =>
        {
            client.disconnect().then(() =>
            {
                return new Promise((resolve) =>
                {
                    expect(dgram_stub.calledWith(JSON.stringify(request), sinon.match.any, sinon.match.any, sinon.match.any)).to.be.true;
                    expect(close_stub.called).to.be.true;
                    resolve();
                });
            });
        }).then(() => server.shutdown(done)).catch((error) =>
        {
            if (error)
                console.error(error);

            expect(error).to.be.undefined;

            server.shutdown(done);
        });
    });

    it('should send a message', (done) =>
    {
        let dgram_stub = sandbox.stub(dgram.Socket.prototype, 'send').yields(null, 10);

        client.connect().then(() =>
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

            return client.send('Hello', 2).then(() =>
            {
                return new Promise((resolve) =>
                {
                    expect(dgram_stub.calledWith(JSON.stringify(request), sinon.match.any, sinon.match.any, sinon.match.any)).to.be.true;
                    resolve();
                });
            });
        }).then(() => server.shutdown(done)).catch((error) =>
        {
            if (error)
            {
                server.shutdown(done);
                console.error(error);
            }

            expect(error).to.be.undefined;

        });
    });

    it('should broadcast a message', (done) =>
    {
        let dgram_stub = sandbox.stub(dgram.Socket.prototype, 'send').yields(null, 10);

        client.connect().then(() =>
        {
            let request: IMessage = {
                type: MessageType.BROADCAST,
                source: {
                    id: 1,
                    username: 'test'
                },
                payload: 'Hello'
            };

            return client.broadcast('Hello').then(() =>
            {
                return new Promise((resolve) =>
                {
                    expect(dgram_stub.calledWith(JSON.stringify(request), sinon.match.any, sinon.match.any, sinon.match.any)).to.be.true;
                    resolve();
                });
            });
        }).then(() => server.shutdown(done)).catch((error) =>
        {
            if (error)
            {
                server.shutdown(done);
                console.error(error);
            }

            expect(error).to.be.undefined;

        });
    });

    it('should register the "message" callback and print the output', (done) =>
    {
        let socket_stub = sandbox.spy(dgram.Socket.prototype, 'on');

        client.connect().then(() =>
        {
            return new Promise((resolve) =>
            {
                // expect(socket_stub.calledTwice).to.be.true;
                expect(socket_stub.firstCall.calledWith('listening')).to.be.true;
                expect(socket_stub.secondCall.calledWith('message')).to.be.true;
                resolve();
            });
        }).then(() => server.shutdown(done)).catch((error) =>
        {
            if (error)
            {
                server.shutdown(done);
                console.error(error);
            }

            expect(error).to.be.undefined;

        });
    });
});