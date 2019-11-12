function say(name)
{
    if(!name)
        return "Hello world!";
    else
        return "Hello " + name + "!";
}

module.exports = {say};
