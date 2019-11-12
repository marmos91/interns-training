export class Challenge
{
    public buzz(value: number)
{
    return new Promise((resolve, reject) =>
{
    if ((value % 3 === 0) && (value % 5 === 0))
        return resolve('fizzbuzz');
    else if (value % 3 === 0)
        return resolve('fizz');
    else if (value % 5 === 0)
        return resolve('buzz');
    else
        return resolve(value);
});

}}
