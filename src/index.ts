export class Challenge {
    buzz(x: number):Promise<string | number> {
        return new Promise((resolve, reject) => {
            if (x % 3 === 0 && x % 5 === 0) return resolve('fizzbuzz')
            if (x % 3 === 0) return resolve('fizz')
            if (x % 5 === 0) return resolve('buzz')
            return resolve(x)
        })
    }
}