const functions = require("../../functions");

const db = require("old-wio.db");
const config = require("../../config.json");
module.exports = {
  name: "replay",
  category: "Music",
  aliases: ["restart"],
  usage: "replay",
  description: "Replays the current song",
  run: async (client, message, args) => {
    //if not a dj, return error
    if(functions.check_if_dj(message))
    return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

    //If Bot not connected, return error
    if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")
    
    //if member not connected return error
    if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")
    
    //if they are not in the same channel, return error
    if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)
    
    //get the Queue
    let queue = client.distube.getQueue(message);

    //if no queue, return error
    if (!queue) return embedbuilder("null", message, config.colors.no, "There is nothing playing!");

    //get current song
    let cursong = queue.songs[0];

    //send information message
    functions.embedbuilder(client, 5000, message, config.colors.yes, "Replaying current song:", `[${cursong.name}](${cursong.url})`, cursong.thumbnail)

    //seek to 0
    return client.distube.seek(message, 0);
  }
};