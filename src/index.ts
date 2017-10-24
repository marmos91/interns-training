export class Challenge {
    public buzz(number : number) {
        if (arguments.length !== 1) {
            return null;
        }
       return new Promise<string | number> (function(resolve, reject) {
            var s : string | number = null;
            if (number % 15 === 0) {
                s = "fizzbuzz";
            } else if (number % 5 === 0) {
                s = "buzz";
            } else if (number % 3 === 0) {
                s = "fizz";
            } else {
                s = number;
            }
            resolve(s);
        });
    }
}