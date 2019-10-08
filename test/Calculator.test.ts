import {Operation, Calculator} from '../src/Calculator';

describe('Level 2 - Calculator', () =>
{
  let calculator: Calculator;

  beforeEach(() => calculator = new Calculator());

  describe('result', () =>
  {
    it('should return a result', () =>
    {
      expect(calculator.result).toBe(0);
    });

    it('should not return a result if an operation is pending', () =>
    {
      calculator.operation(Operation.ADD);
      expect(() => calculator.result).toThrow();
    });

    it('should return the input value as a result if no operations is specified', () =>
    {
      const input = 2;
      calculator.input(input);
      expect(calculator.result).toBe(input);
    });
  });

  describe('input', () =>
  {
    it('should accept an input value without throwing an Error', () =>
    {
      calculator.input(2);
    });

    it('should not perform an unknown operation', () =>
    {
      calculator.input(2);
      calculator.operation(27);
      expect(() => calculator.input(2)).toThrow();
    });

    it('should (ADD) the input to the value', () =>
    {
      calculator.operation(Operation.ADD);
      calculator.input(2);
      expect(calculator.result).toBe(2);
    });

    it('should (SUB)tract the input from the value', () =>
    {
      calculator.operation(Operation.SUB);
      calculator.input(2)
      expect(calculator.result).toBe(-2);
    });

    it('should (MUL)tiply the input to the value', () =>
    {
      calculator.operation(Operation.MUL);
      calculator.input(2);
      expect(calculator.result).toBe(0);
    });

    it('should (DIV)ide the input from the value', () =>
    {
      calculator.input(10);
      calculator.operation(Operation.DIV);
      calculator.input(2);
      expect(calculator.result).toBe(5);
    });

    it('should not (DIV)ide by 0', () =>
    {
      calculator.input(10);
      calculator.operation(Operation.DIV);
      expect(() => calculator.input(0)).toThrow();
    });
  });

  describe('operation', () =>
  {
    it('should accept an operation without throwing an Error', () =>
    {
      calculator.operation(Operation.ADD);
    });

    it('should not accept another operation if a different one is pending', () =>
    {
      calculator.operation(Operation.ADD);
      expect(() => calculator.operation(Operation.SUB)).toThrow();
    });
  });
});
