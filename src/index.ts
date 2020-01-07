export class Challenge {
    buzz(num: number) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (num % 3 === 0 && num % 5 === 0) {
                resolve('fizzbuzz');
            } else if (num % 3 === 0) {
                resolve('fizz');
            } else if (num % 5 === 0) {
                resolve('buzz');
            } else {
                resolve(num);
            }
        });
    }
}
