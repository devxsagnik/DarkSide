const {
    KSoftClient
} = require('@ksoft/api');
const config = require("../../config.json");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const db = require("old-wio.db");
const ksoft = new KSoftClient(process.env.ksoftoken);
const functions = require("../../functions");
// const isAbsoluteUrl = require("is-absolute-url");

module.exports = {
    name: "lyrics",
    category: "Music",
    aliases: ["ly", "songtext"],
    useage: "lyrics",
    description: "Shows you the Lyrics for the CURRENT playing song, ..",
    
    run: async (client, message, args) => {
 
		let song = '';
		if (!args[0]) {
			const player = client.distube.getQueue(message);
			
			if (!player) return message.channel.send('Please provide a song to search for lyrics or play a song.');
			else song = player.songs[0].name;
		}
		else { song = args.join(' '); }

		const msg = await message.channel.send(new MessageEmbed()
		.setTitle(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
		.setDescription(`Searching lyrics with song name \`\`\`${song}\`\`\``)
    .setColor("RANDOM")
    .setTimestamp()
    );
		
		const data = await ksoft.lyrics.get(song, false)
			.catch(err => {
				return message.channel.send(err.message);
			});
		const embed = new Discord.MessageEmbed()
			.setTitle(`${data.name}`)
			.setAuthor(`${data.artist.name}`)
			.setDescription(data.lyrics.slice(0, 2044) + '...')
			.setColor('#d9d9d9')
			.setFooter('Powered by KSoft.Si');
		msg.edit('', embed);
	}
};
