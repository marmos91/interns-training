export class Challenge
{
    public buzz(n: number) :Promise<String | number> 
    {
        let result = '';

        if(n % 3 == 0)
            result = 'fizz';

        if(n % 5 == 0)
            result += 'buzz';

        return new Promise((resolve, reject) => 
        {
            if (result != '')
                return resolve(result);
            else resolve(n);
        });
    }
}
