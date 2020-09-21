module.exports.say = function say(name) 
{
  let innerName = "world";
  if (typeof name !== "undefined") 
  {
    innerName = name;
  }

  return ["Hello ", innerName, "!"].join("");
};
