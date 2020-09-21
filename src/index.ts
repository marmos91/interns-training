class Challenge {
    buzz(input: number): Promise<string | number> {
        return new Promise(resolve => resolve(`${input % 3 === 0 ? "fizz" : ""}${input % 5 === 0 ? "buzz" : ""}` || input));
    }
}

export { Challenge };