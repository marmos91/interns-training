import {expect} from 'chai';
import {Calculator, Operation} from '../src/Calculator';

describe('Level2 - Calculator', () =>
{
    let calculator: Calculator;

    beforeEach(() => calculator = new Calculator());

    it('should return 0 when no values and operations is set', () =>
    {
        expect(calculator.result).to.equal(0);
    });

    it('should return 4 when inputs are 1 and 3 and operation is ADD', () =>
    {
        calculator.input(2);
        calculator.operation(Operation.ADD);
        calculator.input(2);
        expect(calculator.result).to.equal(4);
    });

    it('should return 4 when inputs are 7 and 3 and operation is SUB', () =>
    {
        calculator.input(7);
        calculator.operation(Operation.SUB);
        calculator.input(3);
        expect(calculator.result).to.equal(4);
    });

    it('should return 225 when inputs are 15 and 15 and operation is MUL', () =>
    {
        calculator.input(15);
        calculator.operation(Operation.MUL);
        calculator.input(15);
        expect(calculator.result).to.equal(225);
    });

    it('should return 12 when inputs are 144 and 12 and operation is DIV', () =>
    {
        calculator.input(144);
        calculator.operation(Operation.DIV);
        calculator.input(12);
        expect(calculator.result).to.equal(12);
    });

    it('should throw error when dividing by 0, inputs are 144 and 0 and operation is DIV', () =>
    {
        calculator.input(144);
        calculator.operation(Operation.DIV);
        expect(() => calculator.input(0)).to.throw('Cannot divide by 0. Insert a different value.');
    });

    it('should throw error when operation is pending and another operation is set', () =>
    {
        calculator.operation(Operation.DIV);
        expect(() => calculator.operation(Operation.MUL)).to.throw('Pending operation... Insert a value.');
    });
});
