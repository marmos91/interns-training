import {expect} from 'chai';
import * as sinon from 'sinon';
import * as ServerMock from 'mock-http-server';
import * as fs from 'fs';
import {Webpage} from '../src/Webpage';

describe('Webpage', () => 
{
    const server = new ServerMock({host: 'localhost', port: 9000});
    const path = '/test';
    const body = '<html>hello, world</html>';
    const fsPath = '/fakepath';
    let webppage: Webpage;

    beforeEach(function(done) 
    {
        webppage = new Webpage();
        server.start(done);
        server.on(
        {
            method: 'GET',
            path,
            reply: {
                status: 200,
                body
            }
        });
    });

    afterEach(function(done) 
    {
        server.stop(done);
    });

    it('should return body', async function() 
    {
        expect(await webppage.getWebpage(`http://localhost:9000${path}`)).to.equal(body);
    });

    it('should return body', async function() 
    {
        const stub = sinon.stub(fs, 'writeFile').callsFake((_, __, callback) => callback());

        await webppage.saveWebpage(`http://localhost:9000${path}`, fsPath);
        
        expect(stub.calledWith(fsPath, body)).to.equal(true);
    });

    it('should throw error if code is not 200', async function() 
    {
        server.on(
        {
            method: 'GET',
            path,
            reply: {
                status: 400
            }
        });

        try 
        {
            await webppage.getWebpage(`http://localhost:9000${path}`);
            expect(true).to.equal(false);
        } catch (e) 
        {
            expect(true).to.equal(true);
        }
    });

    it('should throw error if request throws an error', async function() 
    {
        await new Promise(resolve => server.stop(resolve));

        try 
        {
            await webppage.getWebpage(`http://localhost:9000${path}`);
            expect(true).to.equal(false);
        } catch (e) 
        {
            expect(true).to.equal(true);
        }
    });
});