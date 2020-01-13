import { Calculator, Operation } from "../src/Calculator";
import { Webpage } from "../src/Webpage";
import { expect, assert } from "chai";

describe('Level 2 - Unit', () =>
{
    describe('Calculator', () =>
    {
        let calculator: Calculator;

        beforeEach(() => calculator = new Calculator());

        it('should sum 4 and 3 correctly and return 7', () =>
        {
            calculator.input(4);
            calculator.operation(Operation.ADD);
            calculator.input(3);
            expect(calculator.result).to.equal(7);
        });

        it('should subtract 4 and 3 correctly and return 1', () =>
        {
            calculator.input(4);
            calculator.operation(Operation.SUB);
            calculator.input(3);
            expect(calculator.result).to.equal(1);
        });

        it('should multiply 4 and 3 correctly and return 12', () =>
        {
            calculator.input(4);
            calculator.operation(Operation.MUL);
            calculator.input(3);
            expect(calculator.result).to.equal(12);
        });

        it('should divide 4 and 2 correctly and return 2', () =>
        {
            calculator.input(4);
            calculator.operation(Operation.DIV);
            calculator.input(2);
            expect(calculator.result).to.equal(2);
        });

        it('should throw error on sequential operations', () =>
        {
            calculator.input(4);
            calculator.operation(Operation.ADD);
            expect(calculator.operation.bind(calculator, Operation.SUB)).to.throw('Pending operation... Insert a value.');
        });

        it('should throw an error on unknown operation', () =>
        {
            calculator.input(5);
            calculator.operation(8);
            expect(calculator.input.bind(calculator, 2)).to.throw('Unknown operation.');
        });

        it('should throw an error on division by 0', () =>
        {
            calculator.input(5);
            calculator.operation(Operation.DIV);
            expect(calculator.input.bind(calculator, 0)).to.throw('Cannot divide by 0. Insert a different value.');
        });

        it('should throw an error on missing operand', () =>
        {
            calculator.input(5);
            calculator.operation(Operation.DIV);
            expect(calculator.result).to.throw('Pending operation... Insert a value.');
        });
    });

    // describe('WebPage', () =>
    // {
    //     let webPage: Webpage;

    //     beforeEach(() => webPage = new Webpage());



    // });


});