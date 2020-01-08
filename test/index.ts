import {Calculator, Operation} from '../src/Calculator';
import {Webpage} from '../src/Webpage';
import * as ServerMock from 'mock-http-server';
import {expect, assert} from 'chai';
import * as sinon from 'sinon';

describe('Level 2 - Unit Testing (Calculator)', () =>
{
    let calculator: Calculator;

    beforeEach(() => calculator = new Calculator());

    it('should return 5 when added 3 and 2', () =>
    {
        calculator.input(3);
        calculator.operation(Operation.ADD);
        calculator.input(2);
        
        expect(calculator.result).to.equal(5);
    });

    it('should return 1 when subtracted 3 and 2', () =>
    {
        calculator.input(3);
        calculator.operation(Operation.SUB);
        calculator.input(2);
        
        expect(calculator.result).to.equal(1);
    });

    it('should return 6 when multiplied 3 and 2', () =>
    {
        calculator.input(2);
        calculator.operation(Operation.MUL);
        calculator.input(3);
        
        expect(calculator.result).to.equal(6);
    });

    it('should return 1 when divided 3 and 3', () =>
    {
        calculator.input(3);
        calculator.operation(Operation.DIV);
        calculator.input(3);
        
        expect(calculator.result).to.equal(1);
    });

    it('should throw "Division by 0" error', () =>
    {    
        calculator.input(3);
        calculator.operation(Operation.DIV);

        expect(calculator.input.bind(calculator, 0)).to.throw('Cannot divide by 0. Insert a different value.');
    });

    it('should throw "Pending operation" error when is tried to get the result before the an operation executed', () =>
    {    
        calculator.input(3);
        calculator.operation(Operation.SUB);

        expect(() => calculator.result).to.throw('Pending operation... Insert a value.');
    });

    it('should throw "Pending operation" error when is tried to change the operation type before the operation itself', () =>
    {    
        calculator.input(3);
        calculator.operation(Operation.SUB);

        expect(calculator.operation.bind(calculator, Operation.ADD)).to.throw('Pending operation... Insert a value.');
    });

    it('should throw "Unknown operation." error when is tried to set an uknown value as operation (not corresponding to any element decalred in the Operation enum)', () =>
    {    
        calculator.operation(99);

        expect(() => calculator.input(3)).to.throw('Unknown operation.');
    });
});

describe('Level 2 - Unit Testing (Webpage)', () => 
{
    const server = new ServerMock({ host: 'localhost', port: 9000 });
    let web: Webpage;

    beforeEach((done) => 
    {
        web = new Webpage();
        server.start(done);
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

        web.getWebpage("http://localhost:9000/page").then(response => 
        {
            done();
            expect(response).to.equal('<!DOCTYPE><html><html><head></head><body></body></html>');
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

        web.getWebpage("http://localhost:9000/page").catch((error) => 
        {
            expect(error.statusCode).to.equal(404);
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
              spySave = sinon.spy(web, "getWebpage");
              
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