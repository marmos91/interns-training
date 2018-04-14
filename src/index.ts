export class Challenge {
    buzz (numero : number) {
        const result = new Promise(function(resolve, reject){
            if(numero % 3 == 0 && numero % 5 == 0 )
                resolve('fizzbuzz');
            else if(numero % 3 == 0)
                resolve('fizz');
            else if( numero % 5 == 0)
                resolve('buzz');
            else
                resolve(numero);
        });
        return result;
    }
}