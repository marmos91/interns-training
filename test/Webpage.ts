import {Webpage} from '../src/Webpage';
import {expect, assert} from 'chai';
import * as fs from 'fs';

const webpage = new Webpage();
var ServerMock = require("mock-http-server");

describe('Level 2.2 - Webpage Test', ()=>{

    var server = new ServerMock({ host: "localhost", port: 9000 });

    beforeEach(function(done) {
        server.start(done);
    });

    afterEach(function(done) {
        server.stop(done);
    });

    it('Should return the body of the specified url',async() => {
        server.on({
            method: 'GET',
            path: '/resource',
            reply: {
                status:  200,
                headers: { "content-type": "application/json" },
                body: 'esempio'
            }
        });

        const page = await webpage.getWebpage('http://localhost:9000/resource');
        expect(page).to.equal('esempio');
    });

    it('Should retrieve a webpage and save the content to a file', async() =>{

        server.on({
            method: 'GET',
            path: '/resource',
            reply: {
                status:  200,
                headers: { "content-type": "application/json" },
                body: 'esempio'
            }
        });

        try{
            const page = await webpage.saveWebpage('http://localhost:9000/resource','/home/alessandro/Desktop/interns-training/test.txt');
            const content = fs.readFileSync(page,'utf8')
            expect(content).to.equal('esempio');
        }
        catch(error){
            console.log(error);
            expect(0).to.equal(1);  //non sapevo come gestire il catch quindi ho messo questa linea per fare risultare sempre negativo in caso di errore
        }
        });

    it('Should throw an error if something went wrong getting the webpage', () =>{

        server.on({
            method: 'GET',
            path: '/resource',
            reply: {
                status:  200,
                headers: { "content-type": "application/json" },
                body: 'esempio'
            }
        });

        return webpage.saveWebpage('http://localhost:9000/abc','/home/alessandro/Desktop/interns-training/test.txt').catch(err => assert.isDefined(err));

    });

});