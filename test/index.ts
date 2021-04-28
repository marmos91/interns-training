import {expect} from 'chai';
import { write } from 'node:fs';
import {Calculator, Operation} from '../src/Calculator';
import {Webpage} from '../src/Webpage';
const sinon = require('sinon');
const ServerMock  = require('mock-http-server');

describe('level2 Calculator', function ()
{
    let calculator: Calculator;

    beforeEach(() => calculator = new Calculator());

    it('should return the input value when operator is not specified', function()
    {
        calculator.input(2);
        expect(calculator.result).to.be.equal(2);
    });

    it('should sum the two input values', function()
    {
        calculator.input(2);
        calculator.operation(Operation.ADD);
        calculator.input(2);
        expect(calculator.result).to.be.equal(4);
    });

    it('should subtract the two input values', function()
    {
        calculator.input(2);
        calculator.operation(Operation.SUB);
        calculator.input(2);
        expect(calculator.result).to.be.equal(0);
    });
    
    it('should multiplicate the two input values', function()
    {
        calculator.input(2);
        calculator.operation(Operation.MUL);
        calculator.input(2);
        expect(calculator.result).to.be.equal(4);
    });

    it('should divide the two input values', function()
    {
        calculator.input(2);
        calculator.operation(Operation.DIV);
        calculator.input(2);
        expect(calculator.result).to.be.equal(1);
    });

    it('should throw an error when dividing by zero', function()
    {
        calculator.input(2);
        calculator.operation(Operation.DIV);
        expect(() => calculator.input(0)).to.throw('Cannot divide by 0. Insert a different value.');
    });

});

describe('Level 2 WebPage', function ()
{
    let webpage: Webpage;
    let server = new ServerMock({host: 'localhost', port: 8000});

    beforeEach((done) =>
    {
        webpage = new Webpage();
        server.start(done);
    });

    afterEach((done) =>
    {
        server.stop(done)
    });

    it('should call _writeFile', async () =>
    {
        server.on(
            {
                method: 'GET',
                path: '*',
                reply: {
                    status: 200,
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ hello: 'world' })
                }
            }
        )
        let write_file = sinon.spy(webpage, '_writeFile');

        await webpage.saveWebpage('http://localhost:8000', 'content.txt');
        expect(write_file.called).to.be.true;
    });
});