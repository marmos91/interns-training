import {expect} from 'chai'
import {Webpage} from '../src/Webpage'
import {stub} from 'sinon';
import * as ServerMock from 'mock-http-server'
import * as fs from 'fs';

describe('Level 2 - Unit', () =>
{
    describe('Webpage', () =>
    {
        describe('getWebpage method', () =>
        {
            let webpage = new Webpage();
            let server = new ServerMock({ host: 'localhost', port: 9000 });

            before((done) => server.start(done));

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
                    .catch(error => done());
            });

            after((done) => server.stop(done));
        });

        describe('saveWebpage method', () =>
        {
            let get_webpage, write_file, webpage
                , url = 'http://localhost:9000/foo'
                , path = 'my/cool/path'
                , content = 'some content';

            beforeEach(() =>
            {
                webpage = new Webpage();
                get_webpage = stub(webpage, "getWebpage").resolves(content);
                write_file = stub(webpage, "_writeFile").resolves(path);
            });

            afterEach(() =>
            {
                get_webpage.restore();
                write_file.restore();
            });

            it('should call getWebpage and _writeFile once', (done) =>
            {
                webpage.saveWebpage(url, path)
                    .then(() =>
                    {
                        expect(get_webpage.calledOnceWith(url)).to.be.true;
                        expect(write_file.calledOnceWith(path, content)).to.be.true;
                        done();
                    });
            });
        })
    });
});