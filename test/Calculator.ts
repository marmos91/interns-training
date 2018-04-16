import {Calculator} from '../src/Calculator'
import {Operation} from '../src/Calculator';
import {expect} from 'chai';

describe('Level 2.1 - Calculator Test', ()=>{
    let calculator : Calculator;

    beforeEach(() => calculator = new Calculator());

    it('should return the result of the sum ',async () => {
        calculator.input(3);
        calculator.operation(Operation.ADD);
        calculator.input(5);
        expect(await calculator.result).to.equal(8);
    });

    it('should return the result of the multiplication ',async () => {
        calculator.input(3);
        calculator.operation(Operation.MUL);
        calculator.input(5);
        expect(await calculator.result).to.equal(15);
    });

    it('should return the result of the subtraction ',async () => {
        calculator.input(3);
        calculator.operation(Operation.SUB);
        calculator.input(5);
        expect(await calculator.result).to.equal(-2);
    });

    it('should return the result of the division ',async () => {
        calculator.input(25);
        calculator.operation(Operation.DIV);
        calculator.input(5);
        expect(await calculator.result).to.equal(5);
    });

    it('should throw exception if trying to divide by 0',async()=>{
       calculator.input(25);
       calculator.operation(Operation.DIV);
       expect(()=> calculator.input(0)).throw();
    });

    it('should throw exception if an operation is pending',async() =>{
        calculator.operation(Operation.DIV);
        expect(() => calculator.operation(Operation.MUL)).throw();
    });



});