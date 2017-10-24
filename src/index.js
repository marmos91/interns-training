exports.say = function(name) {
    return "Hello " + (arguments.length === 1 ? name : "world") + "!";
}
