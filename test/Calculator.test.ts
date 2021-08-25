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

    const basic_operations_test_data = [
        {input_1:2, operation:Operation.ADD, input_2:2, expected_result: 4},
        {input_1:7, operation:Operation.SUB, input_2:3, expected_result: 4},
        {input_1:15, operation:Operation.MUL, input_2:15, expected_result: 225},
        {input_1:144, operation:Operation.DIV, input_2:12, expected_result: 12},
    ];

    basic_operations_test_data.forEach((data) => 
    {
        it(`should return ${data.expected_result} when inputs are ${data.input_1} and ${data.input_2} and operation is ${Operation[data.operation]}`, () => 
        {
            calculator.input(data.input_1);
            calculator.operation(data.operation);
            calculator.input(data.input_2);
            expect(calculator.result).to.equal(data.expected_result);
        })
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
