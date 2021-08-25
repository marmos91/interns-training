import {expect} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as ServerMock from 'mock-http-server';
import {Webpage} from '../src/Webpage';

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

    it('should return body when getWebpage gets response with status 200 and no errors', async () => 
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

     
           expect(await webpage.getWebpage(url)).to.equal(body); 
       
    });
    
    it('should throw error when getWebpage gets response with 500', async () => 
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

        try
        {
            await webpage.getWebpage(url);
        }
        catch(error)
        {
            expect(error.statusCode).to.equal(500);
        }
    });

    it('should call getWebpage and _writeFile once when executes saveWebpage', async () => 
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
        
        let get_webpage = sinon.spy(webpage, 'getWebpage');
        let write_file = sinon.stub(webpage, '_writeFile' as any);

        await webpage.saveWebpage(url, '/path');

        sinon.assert.calledOnce(get_webpage); 
        sinon.assert.calledOnce(write_file);    
        get_webpage.restore();
        write_file.restore();
    });

    it('should throw error when executes saveWebpage', async () => 
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
        
        let test_error = new Error('test_error');
        let get_webpage = sinon.stub(webpage, 'getWebpage').throws(test_error);

        try
        {
            await webpage.saveWebpage(url, '/path');
        }
        catch(error)
        {
            expect(error).to.equal(test_error);
        }
        finally
        {
            get_webpage.restore();
        }
    });

    // it('should throw error when executes saveWebpage', async () => 
    // {
        
    //     server.on(
    //         {
    //             method: 'GET',
    //             path: '*',
    //             reply: {
    //                 status: 200,
    //                 headers: {'content-type': 'application/json'},
    //                 body: body
    //             }
    //         }
    //     );
        

    //     let get_webpage = sinon.stub(webpage, 'getWebpage').throws(test_error);

    //     await webpage.saveWebpage(url, '/path');
    
    // });
});