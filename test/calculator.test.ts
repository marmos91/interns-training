import { expect } from "chai";
import { Calculator, Operation } from "../src/Calculator";

describe('Calculator', () =>
{
    let calculator: Calculator;

    beforeEach(() =>
    {
        calculator = new Calculator();
    });

    it('should return 0 if no input or operation specified', () =>
    {
        expect(calculator.result).to.eq(0);
    })

    it('should support addition', () =>
    {
        calculator.input(2);
        calculator.operation(Operation.ADD);
        calculator.input(3);
        expect(calculator.result).to.eq(5);
    });

    it('should support multiplication', () =>
    {
        calculator.input(2);
        calculator.operation(Operation.MUL);
        calculator.input(3);
        expect(calculator.result).to.eq(6);
    });

    it('should support division', () =>
    {
        calculator.input(6);
        calculator.operation(Operation.DIV);
        calculator.input(2);
        expect(calculator.result).to.eq(3);
    });

    it('should support subtraction', () =>
    {
        calculator.input(5);
        calculator.operation(Operation.SUB);
        calculator.input(3);
        expect(calculator.result).to.eq(2);
    });

    it('should throw when dividing by 0', () =>
    {
        calculator.input(5);
        calculator.operation(Operation.DIV);
        expect(() => calculator.input(0)).to.throw();
    });

    it('should not accept a second operation before the first gets completed', () =>
    {
        calculator.operation(Operation.ADD);

        expect(() =>
        {
            calculator.operation(Operation.DIV);
        }).to.throw();
    });

    it('should not retrieve a result if an operation is pending', () =>
    {
        calculator.operation(Operation.MUL);

        expect(() =>
        {
            const _ = calculator.result
        }).to.throw();
    });

    it('should not support polish notation', () =>
    {
        // i.e. <operation> <input> <input>
        calculator.operation(Operation.MUL);
        calculator.input(2);
        calculator.input(3)

        const result = calculator.result;
        expect(result).not.to.eq(6);
    });
})