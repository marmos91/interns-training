export class Challenge
{
    public buzz<Promise>(myNumber: number)
    {
        return new Promise((resolve, reject) =>
        {
            var myString: string = '';

            if(myNumber % 3 === 0)
                myString = 'fizz';
            if(myNumber % 5 === 0)
                myString += 'buzz';
            if(myString === '')
                resolve(myNumber);
            else    
                resolve(myString);
        });
    }
}
