export class Challenge 
{
    buzz(num: number): Promise<string | number>
    {
        let res: string | number = "";
        if (num % 3 === 0) res += "fizz";
        if (num % 5 === 0) res += "buzz";
        if (res.length === 0) res = num;
        return new Promise((resolve, reject) => resolve(res));
    }
}
