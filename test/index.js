const hello = require('../src/index.js');
const expect = require('chai').expect;

describe('level0', function ()
{
  it('should say hello world with no parameters', function()
  {
    expect(hello.say()).to.be.equal('Hello world!');
  });
  
  it('should say hello ${name} when a parameter is specified', function()
  {
    expect(hello.say('Marco')).to.be.equal('Hello Marco!');
  });
});