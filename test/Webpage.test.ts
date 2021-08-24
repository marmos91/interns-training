import {expect} from 'chai';
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from 'sinon';
import * as ServerMock from 'mock-http-server';
import {Webpage} from '../src/Webpage';
import { doesNotReject } from 'node:assert';

describe('Level2 - Webpage', () =>
{
    const host = 'localhost';
    const port = 9000;
    const url = `http://${host}:${port}`;
    const body = JSON.stringify({hello: 'world'});
    let webpage: Webpage;
    let server = new ServerMock({host: host, port: port});

    beforeEach((done) =>
    {
        webpage = new Webpage();
        server.start(done);
    });

    afterEach((done) => server.stop(done));

    it('should return body when getWebpage gets response with status 200 and no errors', () => 
    {
        server.on(
            {
                method: 'GET',
                path: '*',
                reply: {
                    status: 200,
                    headers: {'content-type': 'application/json'},
                    body: body
                }
            }
        );

       webpage.getWebpage(url).then((response) => 
       {
           expect(response).to.equal(body); 
       })
    });

    it('should return error when getWebpage gets response with status 500', () => 
    {

        server.on(
            {
                method: 'GET',
                path: '*',
                reply: {
                    status: 500,
                    headers: {'content-type': 'application/json'},
                    body: body
                }
            }
        );

        webpage.getWebpage(url).catch((error) => 
        {
            expect(error.statusCode).to.equal(500);
        });
    });
});