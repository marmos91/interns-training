import { Calculator, Operation } from '../src/Calculator'
import { expect } from 'chai'
import { callbackify } from 'util'

describe('Level 2 - Unit', () => {
    describe('Calculator', () => {
        
        let calculator: Calculator
        let rndOperand: number

        beforeEach(() => {
            calculator = new Calculator()
            rndOperand = Math.floor(Math.random() * 100 - 50)
        })
        
        it('should return 0 if a number is multiplied by 0', () => {
            calculator.input(rndOperand)
            calculator.operation(Operation.MUL)
            calculator.input(0)
            expect(calculator.result).to.be.equal(0)
        })

        it('should return the same number if add 0', () => {
            calculator.input(rndOperand)
            calculator.operation(Operation.ADD)
            calculator.input(0)
            expect(calculator.result).to.be.equal(rndOperand)
        })

        it('should return the same number if subtract 0', () => {
            calculator.input(rndOperand)
            calculator.operation(Operation.MUL)
            calculator.input(3)
            expect(calculator.result).to.be.equal(rndOperand)
        })

        it('should divide two numbers', () => {
            calculator.input(8)
            calculator.operation(Operation.DIV)
            calculator.input(4)
            expect(calculator.result).to.be.equal(8 / 4)
        })

        it('should thorw an error if trying to divide by 0', () => {
            calculator.input(8)
            calculator.operation(Operation.DIV)
            expect(calculator.input.bind(calculator, 0)).to.throw('Cannot divide by 0. Insert a different value.')
        })

        it('should throw an error if was set an unknown operation', () => {
            calculator.input(2)
            calculator.operation(9) // fake an invalid operation
            expect(calculator.input.bind(calculator, 2)).to.throw('Unknown operation.')
        })

        it('should throw an error if trying to get the resut while an incomplete operation is pending', () => {
            calculator.input(8)
            calculator.operation(Operation.DIV)
            try {
                calculator.result
            } catch(err) {
                expect(err.message).to.be.equal('Pending operation... Insert a value.')
            }
        })

        it('should throw an error if two different opeations are input one after the other', () => {
            calculator.input(1)
            calculator.operation(Operation.ADD)
            expect(calculator.operation.bind(calculator, Operation.SUB)).to.throw('Pending operation... Insert a value.')
        })

        it('should not throw an error if two equals opeations are input one after the other', () => {
            calculator.input(1)
            calculator.operation(Operation.ADD)
            expect(calculator.operation.bind(calculator, Operation.ADD)).not.to.throw('Pending operation... Insert a value.')
        })

        it('should process multipleß operations', () => {
            // (((16 + 2) / 3) * 2) - 1
            calculator.input(16)
            calculator.operation(Operation.ADD)
            calculator.input(2)
            calculator.operation(Operation.DIV)
            calculator.input(3)
            calculator.operation(Operation.MUL)
            calculator.input(2)
            calculator.operation(Operation.SUB)
            calculator.input(1)
            expect(calculator.result).to.be.equal(11)
        })
    })
})