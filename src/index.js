module.exports = {
    say: function(name)
    {
        var output;
        //Controllo se sia stringa
        if (typeof(name) == 'undefined')
        {
            //Stringa di default
            output = 'Hello world!';
        }
        else if(name && typeof name === 'string')
        {
            //Passata una stringa
            output = 'Hello '+name+'!';
        }
        else
        {
            console.exit(1);
        }
        return output;
    }
};