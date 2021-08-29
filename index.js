require("dotenv").config();
// const express = require('express')
// const app = express();
// const port = 3000

// app.get('/', (req, res) => res.send('Hey there!'))

// app.listen(port, () =>
//   console.log(`Your app is listening a http://localhost:${port}`.yellow)
// );
const {
  Collection,
  MessageEmbed
} = require('discord.js');
const fs = require("fs");
const Discord = require("discord.js");
var colors = require("colors");
const db = require("old-wio.db");
const Canvas = require("canvas");
const DisTube = require("distube");
const path = require("path");
const { MessageAttachment } = require("discord.js");
const https = require('https-proxy-agent');
const { Default_Prefix, Color } = require("./config.json");
const proxy = 'http://123.123.123.123:8080';
const agent = https(proxy);
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  shards: "auto",
  restWsBridgetimeout: 100,
  disableEveryone: true,
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"],
  disableMentions: "everyone",
  restTimeOffset: 0,
  fetchAllMembers: true,
  messageCacheMaxSize: 5000,
});

const config = require("./config.json");
client.config = config;
client.commands = new Collection();
client.aliases = new Collection();
client.emotes = require('./emojis.json');
client.emoji = require("./emojis.json");

const distube = new DisTube(client, {
  youtubeCookie: client.config.cookie,
  requestOptions: {
    agent
  },
  searchSongs: false,
  emitNewSongOnly: true,
  highWaterMark: 1<<25,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  youtubeDL: true,
  updateYouTubeDL: false,
  customFilters: client.config.customs
});

client.distube = distube;



client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});


client.setMaxListeners(0);
require('events').defaultMaxListeners = 0;
const { DiscordTogether } = require('discord-together');
client.discordTogether = new DiscordTogether(client);
require("./handlers/setups")(client);

const functions = require("./functions");
//databases setups
const Enmap = require("enmap");
client.settings = new Enmap({
  name: "settings",
  dataDir: "./databases/settings"
});
client.setups = new Enmap({ name: "setups", dataDir: "./databases/setups" });
client.infos = new Enmap({
  name: "infos",
  dataDir: "./databases/infos"
});
client.custom = new Enmap({
  name: "custom",
  dataDir: "./databases/playlist"
});
client.custom2 = new Enmap({
  name: "custom",
  dataDir: "./databases/playlist2"
});
Canvas.registerFont('./fonts/Roboto.ttf', { family: 'Roboto' });
Canvas.registerFont('./fonts/sans.ttf', { family: 'Sans' });

client.on('ready', async () => {
  console.log('Bot ready'.cyan);
  const arrayofstatus = [
    `Over ${client.users.cache.size}  users. | D!help`,
    `Made by DarkSide and Team | D!help`
  ];

  let index = 0;

  setInterval(() => {
    if (index === arrayofstatus.length) index = 0;
    const stauts = arrayofstatus[index];
    client.user.setActivity(stauts, { type: 'WATCHING' });
    index++;
  }, 20000);
});

client.on('message', async message => {
  if (message.author.bot || !message.guild || message.webhookID) return;

  let Prefix = await db.fetch(`Prefix_${message.guild.id}`);
  if (!Prefix) Prefix = client.config.Default_Prefix;

  const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);

  if (message.content.match(mentionRegex)) {
    message.channel.send(
      new Discord.MessageEmbed()
        .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
        .setDescription(`Hey <@${message.author.id}>, My prefix for this guild is \`\`\`${Prefix}\`\`\`.Use \`\`\`${Prefix}help\`\`\` or <@873832093078143037>help to get a list of commands`)
        .setColor(Color)
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp()
    )
  };

  //checking for mentions

  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(Prefix)})\\s*`);

  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);
  Prefix = matchedPrefix;


  if (!message.content.startsWith(Prefix)) return;

  if (!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
    return message.reply("**:x: I am missing the Permission to `EMBED_LINKS`**");


  if (client.settings.get(message.guild.id, `botchannel`).toString() !== "") {
    if (!client.settings.get(message.guild.id, `botchannel`).includes(message.channel.id) && !message.member.hasPermission("ADMINISTRATOR")) {
      let leftb = "";
      for (let i = 0; i < client.settings.get(message.guild.id, `botchannel`).length; i++) {
        leftb += "> " + "<#" + client.settings.get(message.guild.id, `botchannel`)[i] + ">\n"
      }
      return functions.embedbuilder(client, 5000, message, config.colors.no, `Not A Bot Channel`, `Please run this command in the bot channel listed below\n${leftb}`)
    }
  }


  let args = message.content
    .slice(matchedPrefix.length)
    .trim()
    .split(/ +/g);
  let cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

  if (!command)
    return;

  try {
    if (command)
        command.run(client, message, args);
  } catch (error) {
    return message.channel.send(`Something Went Wrong, Try Again Later!`);
  };
});

client.login(process.env.TOKEN);
