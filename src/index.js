function say(name)
{
  if(!name)
    return 'Hello world!'

  return `Hello ${name}!`
}

module.exports = {
  say,
}
