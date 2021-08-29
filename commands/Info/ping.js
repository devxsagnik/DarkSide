const Discord = require("discord.js");
const db = require("old-wio.db");

module.exports = {
  name: "ping",
  aliases: ["ms"],
  category: "Info",
  description: "Show Bot Ping!",
  usage: "Ping",
  run: async (client, message, args) => {
    
let start = Date.now();
  
  message.channel.send({embed: {description: "<a:loading:798849635585884211> Loading...", color: "RANDOM"}}).then(m => {
    
    let end = Date.now();
    
    let embed = new Discord.MessageEmbed()
    .setAuthor("Pong!", message.author.avatarURL({ dynamic: true }))
    .addField("API Latency", Math.round(client.ws.ping) + "ms", true)
    .addField("Message Latency", end - start + "ms")
    .setColor("RANDOM");
    m.edit(embed).catch(e => message.channel.send(e))
    
  })

    }
};