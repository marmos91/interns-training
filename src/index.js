function hello(name)
{
    let output = "Hello ";

    if(name)
        output += name + "!";
    else
        output += "world!";

    return output;
}

exports.say = hello;