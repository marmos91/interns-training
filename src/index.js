module.exports.say = function say(name = "world") 
{
  let innerName = "world";
  if (typeof name !== "undefined") 
  {
    innerName = name;
  }
  
  return ["Hello ", innerName, "!"].join("");
};
