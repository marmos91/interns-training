const Calculator = require('../src/Calculator.js').Calculator;
const Operation = require('../src/Calculator.js').Operation;
const Webpage = require('../src/Webpage.js').Webpage;
const expect = require('chai').expect;

let calculator = new Calculator();
let webpage = new Webpage();

describe('Level2 tests', function ()
{
    it('should save the file with a valid URL and path', function()
   {
       let path = 'C:\\Users\\marko\\Desktop\\prova\\wikipedia.txt';
       let url = 'https://it.wikipedia.org/wiki/Pagina_principale';
       let p = webpage.saveWebpage(path, url);
        p.then((path) => expect(path).to.be.equal(path));
    });

    it('should add the numbers 4 and 7', function()
   {
       calculator.input(7);
       calculator.operation(Operation.ADD);
       calculator.input(4);
      
       expect(calculator.result).to.be.equal(11);
    });

    it('should subtract the numbers 7 and 4', function()
   {
       calculator.input(7);
       calculator.operation(Operation.SUB);
       calculator.input(4);
      
       expect(calculator.result).to.be.equal(3);
    });

    it('should multiply the numbers 7 and 4', function()
   {
       calculator.input(7);
       calculator.operation(Operation.MUL);
       calculator.input(4);
      
       expect(calculator.result).to.be.equal(28);
    });

    it('should divide the numbers 7 and 4', function()
   {
       calculator.input(7);
       calculator.operation(Operation.DIV);
       calculator.input(4);

       expect(calculator.result).to.be.equal(1.75);
    });

    it('should not divide the numbers 7 and 0', function()
   {
       calculator.input(7);
       calculator.operation(Operation.DIV);

       expect(() => calculator.input(0)).to.throw(Error);
    });
});
