export class Challenge {
    buzz(value: number): Promise<string | number> {
        const multipleOf3 = value % 3 === 0;
        const multipleOf5 = value % 5 === 0;
        if (multipleOf3 && multipleOf5)
            return Promise.resolve('fizzbuzz');
        if (multipleOf3)
            return Promise.resolve('fizz');
        if (multipleOf5)
            return Promise.resolve('buzz');
        return Promise.resolve(value);
    }
}