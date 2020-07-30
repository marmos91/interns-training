import {Calculator, Operation} from "../src/Calculator";

var calc: Calculator;

var n1: number, n2: number;
n1 = 12;
n2 = 13;

describe("Calculator", () =>
{
	beforeEach(() => calc = new Calculator());

	test.each([[1, 2, 3], [4, -5, -1]])("Addition", (a, b, r) =>
	{
		calc.input(a);
		calc.operation(Operation.ADD);
		calc.input(b);

		expect(calc.result).toBe(r);
	});

	test("Subtraction", () =>
	{
		calc.input(n1);
		calc.operation(Operation.SUB);
		calc.input(n2);

		expect(calc.result).toBe(n1 - n2);
	});
  
	test("Moltiplication", () =>
	{
		calc.input(n1);
		calc.operation(Operation.MUL);
		calc.input(n2);

		expect(calc.result).toBe(n1 * n2);
	});

	test("Division", () =>
	{
		calc.input(n1);
		calc.operation(Operation.DIV);
		calc.input(n2);

		expect(calc.result).toBe(n1 / n2);
	});
});