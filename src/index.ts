export class Challenge 
{
    buzz(num: number): Promise<string | number> 
    {
        return new Promise<string | number>((resolve, reject) => 
        {
            if(num % 3 === 0 && num % 5 === 0)
                return resolve('fizzbuzz');
            else if(num % 3 === 0)
                return resolve('fizz');
            else if(num % 5 === 0)
                return resolve('buzz');

            resolve(num);
        });
    }
}