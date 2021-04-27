export class Challenge
{
    public buzz<Promise>(a: number)
    {
        return new Promise((resolve, reject) =>
        {
            if(a % 3 === 0)
            {
                if(a % 5 === 0)
                    resolve('fizzbuzz');
                else 
                    resolve('fizz');
            }
            else if(a % 5 === 0)
                 resolve('buzz');
            else 
                resolve(a); 
        });
    }
}
