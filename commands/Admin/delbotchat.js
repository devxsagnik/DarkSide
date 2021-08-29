const functions = require("../../functions");
const config = require("../../config.json");
const { Default_Prefix, Color } = require("../../config.json");
const db = require("old-wio.db");
module.exports = {
  name: "removebotchat",
  aliases: ["removechat"],
  category: "Admin",
  description: "Let's you delete the channel for the bot commands",
  usage: "removebotchat #Chat",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return functions.embedbuilder(client, "null", message, config.colors.no, "DISABLE-BOT-CHAT-SETUP", `${client.emotes.no} You don\'t have permission for this Command!`)
    let channel = message.mentions.channels.first();
    if (!channel) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `${client.emotes.no} Please add a Channel via ping, for example: #channel!`)
    try {
      message.guild.roles.cache.get(channel.id)
    } catch {
      return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `${client.emotes.no} It seems that the Channel does not exist in this Server!`)
    }

    if (!client.settings.get(message.guild.id, `botchannel`).includes(channel.id)) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `${client.emotes.no} This Channel is not in the Bot Channel Setup!`)
    message.react(client.emotes.yes);
    client.settings.remove(message.guild.id, channel.id, `botchannel`);

    let leftb = "";
    if (client.settings.get(message.guild.id, `botchannel`).join("") === "") leftb = "No Bot Channel Setup Found!! Commands can be used anywhere."
    else
      for (let i = 0; i < client.settings.get(message.guild.id, `botchannel`).length; i++) {
        leftb += "> " + "<#" + client.settings.get(message.guild.id, `botchannel`)[i] + ">\n"
      }
    return functions.embedbuilder(client, "null", message, config.colors.yes, "Bot Channel Setup", `${client.emotes.yes} Successfully deleted ${channel} from the Bot Channels.\n*Bot Channels left:*\n${leftb}
    `)
  }
};