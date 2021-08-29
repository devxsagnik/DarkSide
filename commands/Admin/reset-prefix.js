const { Default_Prefix, Color } = require("../../config.json");
const db = require("old-wio.db");

module.exports = {
  name: "reset-prefix",
  aliases: ["preset"],
  description: "Reset the prefix in your server",
  category: "Admin",
  usage: "preset",
  
  run: async(client, message, args) => {
   if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You dont have Admin perms to change the prefix");
   
    let Prefix = await db.fetch(`Prefix_${message.guild.id}`);
  if (!Prefix) Prefix = Default_Prefix;

  const p = await db.has(`Prefix_${message.guild.id}`);
  if(p === false) return message.reply(`There is no custom prefix added in this server!! Use ${Default_Prefix}setprefix <prefix> to add one`);
  const reset = await db.delete(`Prefix_${message.guild.id}`); 
  
  message.channel.send(`Prefix has been reset!! Use ${Default_Prefix}help for using the commands`)
 }
}