export class Challenge 
{
    buzz(num: number): Promise<string | number> 
    {
        return new Promise<string | number>((resolve, reject) => 
        {
            let res: string | number = num;

            if(num % 3 === 0 && num % 5 === 0)
                res = 'fizzbuzz';
            else if(num % 3 === 0)
                res = 'fizz';
            else if(num % 5 === 0)
                res = 'buzz';

            resolve(res);
        });
    }
}
