export class Challenge
{
    num: number;

    constructor()
    {
    }

    public buzz(i: number)
    {
        return new Promise(function (resolve, reject)
        {
            if (i % 3 == 0 && i % 5 == 0)
                resolve("fizzbuzz");
            if (i % 3 == 0)
                resolve("fizz");
            if (i % 5 == 0)
                resolve("buzz");
            else
                resolve(i);
        });
    }
}
