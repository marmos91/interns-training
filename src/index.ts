export class Challenge
{
    public buzz(i: number)
    {
        return new Promise(function (resolve, reject)
        {
            if (i % 3 == 0 && i % 5 == 0)
                return resolve("fizzbuzz");
            else if (i % 3 == 0)
                return resolve("fizz");
            else if (i % 5 == 0)
                return resolve("buzz");
            else
                resolve(i);
        });
    }
}
