import {expect} from 'chai';
import {ServerMock} from 'mock-http-server';
import {Calculator, Operation} from '../src/Calculator';
import {Webpage} from '../src/Webpage';


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

describe('Level 2 WebPage', function (){

    let webpage: Webpage;

    beforeEach(()=> webpage = new Webpage);

});