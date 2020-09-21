import {expect} from 'chai';
import {Calculator, Operation} from '../src/Calculator';

describe('Calclulator class', () => 
{
    let calculator: Calculator;

    beforeEach(() => calculator = new Calculator());

    it('Should add 1 and 1', () => 
    {
        calculator.input(1);
        calculator.operation(Operation.ADD);
        calculator.input(1);
        expect(calculator.result).to.equal(2);
    });

    it('Should multiply 1 by 2', () => 
    {
        calculator.input(1);
        calculator.operation(Operation.MUL);
        calculator.input(2);
        expect(calculator.result).to.equal(2);
    });

    it('Should divide 4 by 2', () => 
    {
        calculator.input(4);
        calculator.operation(Operation.DIV);
        calculator.input(2);
        expect(calculator.result).to.equal(2);
    });

    it('Should substract 3 from 4', () => 
    {
        calculator.input(4);
        calculator.operation(Operation.SUB);
        calculator.input(3);
        expect(calculator.result).to.equal(1);
    });

    it('Should throw error when dividing by 0', () => 
    {
        calculator.input(1);
        calculator.operation(Operation.DIV);
        expect(() => calculator.input(0)).throw(Error);
    });
    
    it('Should throw error if operation is incompleted', () => 
    {
        calculator.input(1);
        calculator.operation(Operation.DIV);
        expect(() => calculator.result).throw(Error);
        expect(() => calculator.operation(Operation.ADD)).throw(Error);
    });

    it('Should have initial value 0', () => 
    {
        calculator.operation(Operation.SUB);
        calculator.input(1);
        expect(calculator.result).to.equal(-1);
    });
});
