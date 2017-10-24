module.exports = {
    say: function (name) {
        var s = 'Hello ' + name + '!';
        if (name === undefined)
            s = 'Hello world!';
        return s;
    }
};




