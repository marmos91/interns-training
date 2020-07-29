export class Challenge
{
    public buzz(n: number): Promise<string|number>
    {
        let output: string = "";

        return new Promise<string|number>((resolve, reject) =>
        {
            if(n % 3 == 0)
                output += "fizz";
            
            if(n % 5 == 0)
                output += "buzz";
            else if(n % 3 != 0)
                resolve(n);
            
            resolve(output);
        });
    }
}