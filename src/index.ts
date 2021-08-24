export class Challenge
{
    public buzz(input: number): Promise<string | number>
    {
        let output = '';

        return new Promise((resolve, reject) => 
        {
            if(input % 3 === 0)
                output += 'fizz';

            if(input % 5 === 0)
                output += 'buzz';
            
            if(output)
                 return resolve(output);
                 
            return resolve(input);
        });
    }
}
