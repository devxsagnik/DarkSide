const functions = require("../../functions");
const config = require("../../config.json");
//null
const db = require("old-wio.db");
module.exports = {
    name: "addrelated",
    category: "Music",
    aliases: ["addrelated", "related", "addsimilar", "similar"],
    usage: "addrelated",
    description: "Adds a similar song of the current Track",
    run: async (client, message, args) => {
        //if not a dj, return error - DISABLED cause not needed
        //if (functions.check_if_dj(message))
        //    return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

        //If Bot not connected, return error
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

        //get queue
        let queue = client.distube.getQueue(message);
        
        //if no queue return error
        if (!queue) return functions.embedbuilder(client, 3000, message, config.colors.no, "There is nothing playing!");

        //find related videos
        let newsong = await client.distube.addRelatedVideo(message);

        //send information message
        functions.embedbuilder(client, 10000, message, config.colors.yes, "🔎 Adding:", `[${newsong.songs[0].name}](${newsong.songs[0].url})`, newsong.songs[0].thumbnail)
        
        //play track
        return client.distube.play(message, newsong.songs[0].url)
    }
};