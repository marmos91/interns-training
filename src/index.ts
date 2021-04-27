export class Challenge
{
    public buzz<Promise>(my_number: number)
    {
        return new Promise((resolve, reject) =>
        {
            let my_string: string = '';

            if(my_number % 3 === 0)
                my_string = 'fizz';

            if(my_number % 5 === 0)
                my_string += 'buzz';

            if(my_string === '')
                resolve(my_number);
            else    
                resolve(my_string);
        });
    }
}
