export class Challenge
{
    buzz (entry: number): Promise<any>
    {
        return new Promise(function(resolve, reject)
        {
            if(entry % 3 == 0 && entry % 5 == 0)
                return resolve('fizzbuzz');
            else if(entry % 3 == 0)
                return resolve('fizz');
            else if(entry % 5 == 0)
                return resolve('buzz');
            else
                return resolve(entry);
        });
    }
}