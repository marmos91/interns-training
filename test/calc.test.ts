import {Calculator, Operation} from "../src/Calculator";

var calc: Calculator;

var n1: number, n2: number;
n1 = 12;
n2 = 13;

describe("Calculator", () =>
{
  beforeEach(() => calc = new Calculator());

  test("Addition", () =>
  {
    calc.input(n1);
    calc.operation(Operation.ADD);
    calc.input(n2);
    
    expect(calc.result).toBe(n1 + n2);
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