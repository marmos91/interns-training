import { Calculator, Operation } from '../src/Calculator';
import { expect } from 'chai';
import 'mocha';


describe("Calculator Functions", function()
{
    const calc = new Calculator();

    describe("ADDITION", function()
{
    it("should add two positive numbers", function()
    {
        calc.input(3);
        calc.operation(Operation.ADD);
        calc.input(2);
        expect(calc.result).to.equal(5);
    });

        it("should add a positive and a negative number", function()
    {
        calc.input(-3);
        calc.operation(Operation.ADD);
        calc.input(4);
        expect(calc.result).to.equal(1);
    });

        it("should give 0 value when adding a value and zero", function()
    {
        calc.input(3);
        calc.operation(Operation.ADD);
        calc.input(0);
        expect(calc.result).to.equal(3);
    });
});
    describe("MULTIPLICATION", function()
{

    it("should multiply two positive numbers", function()
    {
        calc.input(3);
        calc.operation(Operation.MUL);
        calc.input(2);
        expect(calc.result).to.equal(6);
    });

        it("should multiply a positive and a negative number", function()
    {
        calc.input(3);
        calc.operation(Operation.MUL);
        calc.input(-1);
        expect(calc.result).to.equal(-3);
    });

        it("should give the same value when adding zero", function()
    {
        calc.input(3);
        calc.operation(Operation.MUL);
        calc.input(0);
        expect(calc.result).to.equal(0);
    });

});
});
