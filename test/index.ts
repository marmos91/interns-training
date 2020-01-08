import { Calculator, Operation } from '../src/Calculator';
import { Webpage } from '../src/Webpage';
import * as ServerMock from 'mock-http-server';
import { expect, assert } from 'chai';
import * as sinon from 'sinon';

describe('Level 2 - Unit Testing (Calculator)', () =>
{
    let calc: Calculator;

    beforeEach(() => calc = new Calculator());

    it('should return 5 when added 3 and 2', () =>
    {
        calc.input(3);
        calc.operation(Operation.ADD);
        calc.input(2);
        
        expect(calc.result).to.equal(5);
    });

    it('should return 1 when subtracted 3 and 2', () =>
    {
        calc.input(3);
        calc.operation(Operation.SUB);
        calc.input(2);
        
        expect(calc.result).to.equal(1);
    });

    it('should return 6 when multiplied 3 and 2', () =>
    {
        calc.input(2);
        calc.operation(Operation.MUL);
        calc.input(3);
        
        expect(calc.result).to.equal(6);
    });

    it('should return 1 when divided 3 and 3', () =>
    {
        calc.input(3);
        calc.operation(Operation.DIV);
        calc.input(3);
        
        expect(calc.result).to.equal(1);
    });

    it('should throw "Division by 0" error', () =>
    {    
        calc.input(3);
        calc.operation(Operation.DIV);

        expect(calc.input.bind(calc, 0)).to.throw('Cannot divide by 0. Insert a different value.');
    });

    it('should throw "Pending operation" error when is tried to get the result before the an operation executed', () =>
    {    
        calc.input(3);
        calc.operation(Operation.SUB);

        expect(() => calc.result).to.throw('Pending operation... Insert a value.');
    });

    it('should throw "Pending operation" error when is tried to change the operation type before the operation itself', () =>
    {    
        calc.input(3);
        calc.operation(Operation.SUB);

        expect(calc.operation.bind(calc, Operation.ADD)).to.throw('Pending operation... Insert a value.');
    });

    it('should throw "Unknown operation." error when is tried to set an uknown value as operation (not corresponding to any element decalred in the Operation enum)', () =>
    {    
        calc.operation(99);

        expect(() => calc.input(3)).to.throw('Unknown operation.');
    });
});

describe('Level 2 - Unit Testing (Webpage)', () => 
{
    const server = new ServerMock({ host: 'localhost', port: 9000 });
    let web: Webpage;

    beforeEach((done) => 
    {
        server.start(done);
        web = new Webpage();
    });

    afterEach((done) => server.stop(done));

    it('should return the html of the page requested from the mocked webserver', (done) => 
    {
        server.on({
            method: 'GET',
            path: '/page',
            reply: {
                status: 200,
                headers: { "content-type": "text/html" },
                body: '<!DOCTYPE><html><html><head></head><body></body></html>'
            }
        });

        web.getWebpage("http://localhost:9000/page").then(res => 
        {
            done();
            expect(res).to.equal('<!DOCTYPE><html><html><head></head><body></body></html>');
        });
    });

    it('should return status code 404 from the mocked webserver from the requested page', (done) => 
    {
        server.on({
            method: 'GET',
            path: '/page',
            reply: {
                status: 404
            }
        });

        web.getWebpage("http://localhost:9000/page").catch((err) => 
        {
            expect(err.statusCode).to.equal(404);
            done();
        });
    });

    it('should just fail the promise of saveWebpage', (done) =>
    {
        const path = 'static/page.html',
              saveFile = sinon.stub(web, "saveWebpage").rejects();

        server.on({
            method: 'GET',
            path: '/page',
            reply: {
                status: 404,
                headers: { "content-type": "text/plain" }
            }
        });

        web.saveWebpage("http://localhost:9000/page", path).catch(() => 
        {
            saveFile.restore();
            done();
        });
    });

    it('should just check if getWebpage is called once with saveWebpage', (done) =>
    {
        const path = 'static/page.html',
              spySave = sinon.spy(web, "getWebpage"); // makes more sense if we could spy on _writeFile but is private, i didn't find a way sadly
              
        server.on({
            method: 'GET',
            path: '/page',
            reply: {
                status: 200,
                headers: { "content-type": "text/html" },
                body: '<!DOCTYPE><html><html><head></head><body></body></html>'
            }
        });

        web.saveWebpage("http://localhost:9000/page", path).catch(() => 
        {
            assert(spySave.calledOnce);
            done();
        });
    });
});