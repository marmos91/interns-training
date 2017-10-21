import {Challenge} from '../src/index';
import {expect} from 'chai';

describe('Level 1 - FizzBuzz', () =>
{
    let challenge: Challenge;

    beforeEach(() => challenge = new Challenge());

    it('should return Fizz when input is multiple of 3', async () =>
    {
        expect(await challenge.buzz(9)).to.equal('fizz');
        expect(await challenge.buzz(12)).to.equal('fizz');
    });

    it('should return Buzz when input is multiple of 5', async () =>
    {
        expect(await challenge.buzz(5)).to.equal('buzz');
        expect(await challenge.buzz(10)).to.equal('buzz');
    });

    it('should return Buzz when input is both multiple of 3 and 5', async () =>
    {
        expect(await challenge.buzz(15)).to.equal('fizzbuzz');
        expect(await challenge.buzz(30)).to.equal('fizzbuzz');
    });

    it('should return the input when input is not multiple of 5 or 3', async () =>
    {
        expect(await challenge.buzz(7)).to.equal(7);
        expect(await challenge.buzz(11)).to.equal(11);
    });
});