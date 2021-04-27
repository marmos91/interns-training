function say(name)
{
    if(name === undefined)
        return 'Hello world!';
    else
        return 'Hello ' + name + '!';
}

module.exports = { say };