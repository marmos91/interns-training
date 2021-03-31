
function say(name){
    if(name!=null)
        return "Hello " + name + "!";
    else return "Hello world!"
}

module.exports = {say:say}