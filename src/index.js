module.exports.say = function say(name) 
{
  var innerName = "world";
  if (typeof name !== "undefined") 
{
    innerName = name;
  }
  return ["Hello ", innerName, "!"].join("");
};
