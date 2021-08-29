const functions = require("../../functions");
const config = require("../../config.json");
const { Default_Prefix, Color } = require("../../config.json");
const { MessageEmbed } = require("discord.js");
const db = require("old-wio.db");
module.exports = {
    name: "djs",
    aliases: ["dj"],
    category: "Info",
    description: "Shows you a array of dj roles present in the server",
    usage: "dj",
    run: async (client, message, args) => {
       try {
      //create the string of all djs and if he is a dj then set it to true
      let isdj = false;
      let leftb = "";
      if (client.settings.get(message.guild.id, `djroles`).join("") === "")
        leftb = "no Dj Roles, aka all Users are Djs  "
      else
        for (let i = 0; i < client.settings.get(message.guild.id, `djroles`).length; i++) {
          if (message.member.roles.cache.has(client.settings.get(message.guild.id, `djroles`)[i])) isdj = true;
          if (!message.guild.roles.cache.get(client.settings.get(message.guild.id, `djroles`)[i])) continue;
          leftb += "<@&" + client.settings.get(message.guild.id, `djroles`)[i] + ">\n"
        }

      message.channel.send(new MessageEmbed()
        .setColor(Color)
        .setTitle("💢 Dj Mode")
        .setDescription("If a Command is listed here, and at least one role exists, then it means that you have to have this Role, in order to be able to use these listed Commands")
      
        .addField("🎧 Dj Roles", `${leftb ? leftb.length < 0 ? "no Dj Roles, aka all Users are Djs" : leftb.substr(0, leftb.length-1) : "no Dj Roles, aka all Users are Djs"}`, true)
        .setFooter("© Beat Box")
      );
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new MessageEmbed()
        .setColor("#ff0000")
        .setFooter("© Beat Box")
        .setTitle(`:x: ERROR | An error occurred`)
        .setDescription(`\`\`\`${e.message}\`\`\``)
      );
    }
  }
}