export class Challenge
{
    public buzz<Promise>(input_number: number)
    {
        return new Promise((resolve, reject) =>
        {
            let resolve_string: string = '';

            if(input_number % 3 === 0)
                resolve_string = 'fizz';

            if(input_number % 5 === 0)
                resolve_string += 'buzz';

            if(resolve_string === '')
                resolve(input_number);
            else    
                resolve(resolve_string);
        });
    }
}
