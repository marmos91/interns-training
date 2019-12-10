import {expect} from 'chai'
import {Webpage} from '../src/Webpage'
import * as ServerMock from 'mock-http-server'

describe('Level 2 - Unit', () =>
{
    describe('Webpage', () =>
    {
        let server = new ServerMock({ host: 'localhost', port: 8080 });
        let webpage = new Webpage();

        beforeEach((done) => server.start(done));
        afterEach((done) => server.stop(done));

        it('should call getWebPage and _writeFile once', () =>
        {
            server.on({
                method: 'GET',
                path: '/',
                reply: {
                    status:  200,
                    headers: { "content-type": "text/html" },
                    body: `
                    <html>
                        <body>
                            <h1>Hello, Cubbit!</h1>
                        </body>
                    </html>`
                }
            });

            return webpage.saveWebpage('http://localhost:8080/', '~/Desktop');

        });
    });
});