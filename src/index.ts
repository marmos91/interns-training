export class Challenge 
{
    buzz(num: number): Promise<string | number>
    {
        let response: string | number = "";

        if(num % 3 === 0)
            response += "fizz";

        if(num % 5 === 0)
            response += "buzz";

        if(response.length === 0)
            response = num;

        return new Promise((resolve, reject) => resolve(response));
    }
}
