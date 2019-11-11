function say(name)
{
  if (name === undefined || name === null )
  {
    return "Hello world!";
  }
  else
  {
  return "Hello " + name + "!";
  }
}

module.exports = {say};
