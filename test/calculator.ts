import {Calculator, Operation} from '../src/Calculator';
import {expect} from 'chai';

describe('Level 2- Unit', () =>
{
    let calculator : Calculator;
    beforeEach (()=> calculator = new Calculator());

    //Test

    it('ADD:Should return to the value 8!', () =>
    {
        calculator.input(3);
        calculator.operation(Operation.ADD);
        calculator.input(5);
        expect(calculator.result).to.equal(8);

    });

    it('DIV:Should return to the value 5!', () =>
    {
        calculator.input(15);
        calculator.operation(Operation.DIV);
        calculator.input(3);
        expect(calculator.result).to.equal(5);

    });

    it('MUL:Should return to the value 15!', () =>
    {
        calculator.input(3);
        calculator.operation(Operation.MUL);
        calculator.input(5);
        expect(calculator.result).to.equal(15);

    });

    it('MUL1:Should return to the value 0!', () =>
    {
        calculator.input(3);
        calculator.operation(Operation.MUL);
        calculator.input(0);
        expect(calculator.result).to.equal(0);

    });

    it('SUB:Should return to the value 10!', () =>
    {
        calculator.input(15);
        calculator.operation(Operation.SUB);
        calculator.input(5);
        expect(calculator.result).to.equal(10);

    });

    it('SUB:Should return to error', () =>
    {
        calculator.input(15);
        calculator.operation(Operation.DIV);
        expect( ()=>  calculator.input(0)).to.throw(Error);
    });

})

