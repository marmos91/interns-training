export class Challenge
{
    public buzz(n: number) :Promise<any> 
    {
        var result: string;

        result = '';
        if(n % 3 == 0)
            result = 'fizz';
        if(n % 5 == 0)
            result += 'buzz';

        var p = new Promise((resolve, reject) => 
        {
            if (result != '')
                resolve(result);
            else resolve(n);
        });

        return p;
    }
}
