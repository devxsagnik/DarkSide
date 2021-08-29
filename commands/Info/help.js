const { Default_Prefix } = require("../../config.json");
const Discord = require("discord.js");
const config = require("../../config.json");
const db = require("old-wio.db");
const { MessageEmbed } = require("discord.js");
const pagination = require('discord.js-pagination');
const { readdirSync } = require("fs");
const ms = require("ms");
const emoji = require("../../emojis.json");
const { oneLine, stripIndent } = require('common-tags');

module.exports = {
  name: "help",
  aliases: ["h"],
  category: "Info",
  description: "Shows the help menu of Beat Box",
  usage: "help / help <Command Name>",
 
  run: async (client, message, args) => {
    let p = await db.fetch(`Prefix_${message.guild.id}`);
    if (!p) p = Default_Prefix;

    const emoji = {
        Admin: `${client.emotes.admin}`,
        DiscordTogether: `👭`,
        Info: `${client.emotes.info}`,
        Music: `${client.emotes.music}`,
        Music_Filters: `${client.emotes.filters}`,
        Owner: `👑`
      };

      if (!args[0]) {
        let categories = [];
        readdirSync("./commands/").forEach(dir => {
          const category = ["Owner"];
          if (category.includes(dir)) return;
          const edited = `${emoji[dir]} ${dir}`;
          let data = new Object();
          data = {
            name: edited,
            value: `\`${p}help ${dir.toLowerCase()}\``,
            inline: true,
          };
          categories.push(data);
        });
        const embed = new MessageEmbed()
          .setTitle(`**${client.user.username} Commands**`)
          .addFields(categories)
          .setDescription(stripIndent`
          :white_small_square: The Prefix for ${message.guild.name} is \`${p}\`
    
          `)
          .addField(
            '\u200b', 
            `[Support Server](https://discord.gg/TfG7ygZBe6)**`
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter(
            `Requested by ${message.author.tag}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTimestamp()
          .setColor("#f0e2e2");
        return message.channel.send(embed);
      } else if (args[0] === "info") {
        const commandList = [];
        readdirSync(`./commands/Info`).forEach(file => {
          const pull = require(`../../commands/Info/${file}`);
          const name = `\`${pull.name}\``;
          commandList.push(name);
        });
        return message.reply(
          new MessageEmbed()
            .setDescription(commandList.map(data => `${data}`).join(", "))
            .setTimestamp()
            .addField(
              '\u200b', 
              `[Support Server](https://discord.gg/TfG7ygZBe6)**`
            )
            .setColor('#f0e2e2')
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`${client.emotes.info} **Information Commands**`)
        );
      } else if (args[0] === "admin") {
        const commandList = [];
        readdirSync(`./commands/Admin`).forEach(file => {
          const pull = require(`../../commands/Admin/${file}`);
          const name = `\`${pull.name}\``;
          commandList.push(name);
        });
        return message.reply(
          new MessageEmbed()
            .setDescription(commandList.map(data => `${data}`).join(", "))
            .setTimestamp()
            .setColor('#f0e2e2')
            .addField(
              '\u200b', 
                `[Support Server](https://discord.gg/TfG7ygZBe6)**`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(
              `${client.emotes.admin} **Admin Commands**`
            )
        );
      } else if (args[0] === "music") {
        const commandList = [];
        readdirSync(`./commands/Music`).forEach(file => {
          const pull = require(`../../commands/Music/${file}`);
          if (pull.hidden) return;
          const name = `\`${pull.name}\``;
          commandList.push(name);
        });
        return message.reply(
          new MessageEmbed()
            .setDescription(commandList.map(data => `${data}`).join(", "))
            .setTimestamp()
            .addField(
              '\u200b', 
                `[Support Server](https://discord.gg/TfG7ygZBe6)**`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor('#f0e2e2')
            .setTitle(
              `${client.emotes.music} **Music Commands**`
            )
        );
      } else if (args[0] === "filters" || args[0] === "musicfilters" || args[0] === "music_filters") {
        const commandList = [];
        readdirSync(`./commands/Music_Filters`).forEach(file => {
          const pull = require(`../../commands/Music_Filters/${file}`);
          if (pull.hidden) return;
          const name = `\`${pull.name}\``;
          commandList.push(name);
        });
        return message.reply(
          new MessageEmbed()
            .setDescription(commandList.map(data => `${data}`).join(", "))
            .setTimestamp()
            .setColor('#f0e2e2')
            .addField(
              '\u200b', 
                `[Support Server](https://discord.gg/TfG7ygZBe6)**`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(
            `${client.emotes.filters} **Music Filter Commands**`
            )
        );
      } else if (args[0] === "discordtogether" || args[0] === "together" || args[0] === "discord_together") {
        const commandList = [];
        readdirSync(`./commands/DiscordTogether`).forEach(file => {
          const pull = require(`../../commands/DiscordTogether/${file}`);
          if (pull.hidden) return;
          const name = `\`${pull.name}\``;
          commandList.push(name);
        });
        return message.reply(
          new MessageEmbed()
            .setDescription(commandList.map(data => `${data}`).join(", "))
            .setTimestamp()
            .setColor('#f0e2e2')
            .setThumbnail(client.user.displayAvatarURL())
            .addField(
              '\u200b', 
                `[Support Server](https://discord.gg/TfG7ygZBe6)**`
            )
            .setTitle(
            `👭 **Discord Together Commands**`
            )
        );
      } else {
        const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          c => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );
      if (!command) return message.channel.send(
          `${client.emotes.no} There isn't any command or category named "${args[0]}.Try again later. :("`
        );
        if(command.category === "Owner" && !client.config.developers.includes(message.author.id)) return message.channel.send(`${client.emotes.no} You're not authorized to view that command.Sorry :(`)
        const embed = new MessageEmbed()
          .setTitle(`${capitalize(command.name)} Command Details`)
          .setThumbnail(client.user.displayAvatarURL())
          .addField(
            "**Command**:",
            command.name ? `\`${command.name}\`` : "N/A"
          );
        if (command.aliases) {
          embed.addField("**Aliases**:", `\`${command.aliases.join(", ")}\``);
        }
        if (command.usage) {
          embed.addField(
            "**Usage**:",
            `\`${command.usage}\``
          );
        } else {
          embed.addField("**Usage**:", `\`${p}${command.name}\``);
        }
        if (command.description) {
          embed.addField("**Description**:", command.description ? `\`${command.description}\`` : "No description for a basic command :(");
        }
        embed
          .setFooter(
            `Requested by ${message.author.username}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .addField(
            '\u200b', 
            `[Support Server](https://discord.gg/TfG7ygZBe6)**`
          )
          .setTimestamp()
          .setURL(client.config.Invite)
          .setColor("#f0e2e2");
        message.reply(embed);
      }

      function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
  }