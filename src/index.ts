export class Challenge
{
    public buzz(x: number): Promise <number | string>
    {
        return new Promise <number | string>((resolve) =>
        {
            let output: number | string = null;
            if (x % 15 === 0)
                output = 'fizzbuzz';
            else if (x % 3 === 0)
                output = 'fizz';
            else if (x % 5 === 0)
                output='buzz';
            else
                output = x;

            return resolve(output);
        });
    }
}