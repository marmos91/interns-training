function say(name) {
  if (name === undefined || name === null ){
    return "Hello world!";
  } else {
  return "Hello " + name + "!";
  }
}

console.log(say("momo"));
console.log(say());

module.exports = {say};
