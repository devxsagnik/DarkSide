const functions = require("../../functions");
const config = require("../../config.json");
const { Default_Prefix, Color } = require("../../config.json");
const db = require("old-wio.db");
module.exports = {
  name: "addbotchat",
  aliases: ["addbotchannel"],
  category: "Admin",
  description: "Let's you enable a bot only chat where the community is allowed to use commands",
  usage: "addbotchat <#chat>",
  run: async (client, message, args) => {
    //command
    if (!message.member.hasPermission("ADMINISTRATOR")) return functions.embedbuilder(client, "null", message, config.colors.no, "BOT-CHAT-SETUP", `❌ You don\'t have permission for this Command!`)

    let channel = message.mentions.channels.first();
    if (!channel) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `:x: Please add a Channel via ping, for example: #channel!`)
    try {
      message.guild.roles.cache.get(channel.id)
    } catch {
      return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `:x: It seems that the Channel does not exist in this Server!`)
    }
    if (client.settings.get(message.guild.id, `botchannel`).includes(channel.id)) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `:x: This Channel is alerady in the List!`)

    message.react(client.emotes.yes);

    client.settings.push(message.guild.id, channel.id, `botchannel`);
    let leftb = "";
    if (client.settings.get(message.guild.id, `botchannel`).join("") === "") leftb = "No bot channels are set by the owner.Commands are not restricted in any channel!!"
    else
      for (let i = 0; i < client.settings.get(message.guild.id, `botchannel`).length; i++) {
        leftb += "> " + "<#" + client.settings.get(message.guild.id, `botchannel`)[i] + ">\n"
      }
    let botchatfromenmap = message.guild.channels.cache.get(client.settings.get(message.guild.id, `botchannel`)[client.settings.get(message.guild.id, `botchannel`).length])

    return functions.embedbuilder(client, "null", message, config.colors.rankyes, "Bot Channel Setup", `${client.emotes.yes} Successfully added the Bot Channel to ${channel}\n*Here are all the Bot Channels:*\n${leftb}`)

  }
};