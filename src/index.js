function say(name)
{
    if(name!=null)
        return 'Hello ' + name + '!';
    
    return 'Hello world!';
}

module.exports = {say};
