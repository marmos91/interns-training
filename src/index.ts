export class Challenge {
  async buzz(x: number)
  {
    let output = ''
    if(x % 3 === 0)
      output += 'fizz'
    if(x % 5 === 0)
      output += 'buzz'

    if(!output)
      return x

    return output
  }
}
