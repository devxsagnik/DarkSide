const { Default_Prefix, Color } = require("../../config.json");
const Discord = require("discord.js");
const db = require("old-wio.db");

module.exports = {
  name: "setprefix",
  aliases: ["newprefix", "sp"],
  category: "Admin",
  description: "Set The Prefix Of Bot!",
  usage: "Setprefix <New Prefix>",
  run: async (client, message, args) => {
    
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("You Don't Have Enough Permission To Execute This Command - Manage Server");
    
    let Prefix = await db.fetch(`Prefix_${message.guild.id}`);
    if (!Prefix) Prefix = Default_Prefix;
    
    const NewPrefix = args.join(" ");
    
    if (!NewPrefix) return message.channel.send("Please Give New Prefix Of Bot!");

    if (
      NewPrefix.match(/^(?:<@!?)?(\d{16,22})>/gi) ||
      NewPrefix.match(/^(?:<#?)?(\d{16,22})>$/gi) ||
      NewPrefix.match(/^(?:<:(?![\n])[()#$@-\w]+:?)?(\d{16,22})>$/gi)
    ) {
      return message.reply("WTH dude, I am not soo foolish to accept custom emoji as my prefix!! -_-")
    };
    
    if (NewPrefix.length > 4) return message.channel.send("Too Long Prefix - 04 Limit");

    if (NewPrefix === Prefix) return message.channel.send("Given Prefix Is The Current Prefix!");
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color || "RANDOM")
    .setTitle("Hmmm Changed!!")
    .setDescription(`Enjoy this servers new prefix - \`\`\`${NewPrefix}\`\`\``)
    .setFooter(`Setted By ${message.author.username}`)
    .setTimestamp();
    
    await db.set(`Prefix_${message.guild.id}`, NewPrefix);
    
    try {
      return message.channel.send(Embed);
    } catch (error) {
      return message.channel.send(`New Prefix Has Been Setted - ${NewPrefix}`);
    };
  }
};