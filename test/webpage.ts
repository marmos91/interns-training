import {Webpage} from '../src/Webpage';
import {expect} from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';

var ServerMock = require("mock-http-server");

describe('Level 2- Unit', () => {

    let webpage : Webpage;
    let server : any;
    beforeEach (()=> webpage = new Webpage());

    before( function(done)
    {
        server = new ServerMock({ host: "localhost", port: 9000 });
        server.on({
            method :'GET',
            path : '/resource',
            reply: {
                status : 200,
                body: 'Hello world'
            }
        });

        server.start(done);
    });

    after(function(done)
    {
        server.stop(done);
    });

    // it('Should return to ', async () =>
    // {
    //     await webpage.saveWebpage('http://127.0.0.1:9000/resource', 'test/Prova_scrittura');  //http://
    //     expect(fs.existsSync('test/Prova_scrittura')).to.be.true;
    // });

    it('Should return to ', async () =>
    {
        let sandbox = sinon.sandbox.create();
        let stub = sandbox.stub(fs,'writeFile').withArgs(sinon.match.string,sinon.match.string, sinon.match.func).yields(null);
        await webpage.saveWebpage('http://127.0.0.1:9000/resource', 'test/Prova_scrittura');  //http://
        expect(stub.calledOnce).to.be.true;
        sandbox.restore();
    });




})