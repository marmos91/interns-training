import {Calculator, Operation} from "../src/Calculator";

let calc: Calculator;

describe("Calculator", () =>
{
	beforeEach(() => calc = new Calculator());

	test.each([[1, 2, 3], [4, -5, -1]])("Addition", (addend1, addend2, sum) =>
	{
		calc.input(addend1);
		calc.operation(Operation.ADD);
		calc.input(addend2);

		expect(calc.result).toBe(sum);
	});

	test.each([[10, 2, 8], [2, 6, -4]])("Subtraction", (minuend, subtrahend, difference) =>
	{
		calc.input(minuend);
		calc.operation(Operation.SUB);
		calc.input(subtrahend);

		expect(calc.result).toBe(difference);
	});
  
	test.each([[2, 3, 6], [-7, 2, -14]])("Moltiplication", (multiplicand, multiplier, product) =>
	{
		calc.input(multiplicand);
		calc.operation(Operation.MUL);
		calc.input(multiplier);

		expect(calc.result).toBe(product);
	});

	test.each([[12, 3, 4], [39, 3, 13]])("Division", (dividend, divisor, quotient) =>
	{
		calc.input(dividend);
		calc.operation(Operation.DIV);
		calc.input(divisor);

		expect(calc.result).toBe(quotient);
	});
});