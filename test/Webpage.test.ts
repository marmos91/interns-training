import {expect} from 'chai'
import {Webpage} from '../src/Webpage'
import * as ServerMock from 'mock-http-server'

describe('Level 2 - Unit', () =>
{
    describe('Webpage', () =>
    {
        describe('getWebpage method', () =>
        {
            let webpage;
            let server = new ServerMock({ host: 'localhost', port: 9000 });

            beforeEach((done) => {
                webpage = new Webpage()
                server.start(done)
            });
            afterEach((done) => server.stop(done));

            it('should resolve to page body', (done) =>
            {
                server.on({
                    method: '*',
                    path: '/test',
                    reply: {
                        status: 200,
                        headers: { 'content-type': 'text/html'},
                        body: '<h1>Hello, Cubbit!</h1>'
                    }
                });

                webpage.getWebpage('http://localhost:9000/test')
                    .then((body) =>
                    {
                        expect(body).to.be.equal('<h1>Hello, Cubbit!</h1>');
                        done();
                    });
            });

            it('should reject if page not found', (done) =>
            {
                server.on({
                    method: '*',
                    path: '/test',
                    reply: {
                        status: 404,
                        headers: { 'content-type': 'text/html'},
                        body: '<h1>Hello, Cubbit!</h1>'
                    }
                });

                webpage.getWebpage('http://localhost:9000/test')
                    .catch(error =>
                        {
                            done();
                        });
            });
        })
    });
});