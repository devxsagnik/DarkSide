const config = require("../config.json");
console.log("Loading Setups");
const functions = require("../functions");
module.exports = (client) => {
    const guildonlycounter = new Map();
    let stateswitch = false;
    
    client.on("ready", () => {
        setInterval(() => {
            let guilds = client.guilds.cache.keyArray()
            let usercount = 0;
            for (let i = 0; i < guilds.length; i++) {
                usercount += Number(client.guilds.cache.get(guilds[i]).memberCount);
            }
            usercount = client.users.cache.size;
        }, 5000); //5 second delay

        setInterval(() => {
            client.guilds.cache.forEach(async guild => {
                await functions.delay(client.ws.ping);
                let member = await client.guilds.cache.get(guild.id).members.cache.get(client.user.id)
                //if not connected
                if (!member.voice.channel)
                    return;
                if (member.voice.channel.members.size === 1) {
                    if (!guildonlycounter.has(guild.id)) return guildonlycounter.set(guild.id);
                    guildonlycounter.delete(guild.id);
                    return member.voice.channel.leave();
                }
            });
        }, (30 * 1000));
    });

    client.on("guildCreate", guild => {
        console.log("Hey, I got invited to a Server".yellow)
        //WHEN INVITED, create Databases for this guild
        client.custom.set(guild.id, {
            playlists: [],
        });
        client.settings.set(guild.id, {
            prefix: config.Default_Prefix,
            djroles: [],
            playingembed: "",
            playingchannel: "",
            botchannel: [],
        });
    })
    //When a Channel got deleted, try to remove it from the BOTCHANNELS     
    client.on("channelDelete", function (channel) {
        try{client.settings.remove(channel.guild.id, channel.id, `botchannel`);}catch{}
        try{client.setups.remove(channel.guild.id, channel.id, `botchannel`);}catch{}
    });
    //When a Role got deleted, try to remove it from the DJROLES
    client.on("roleDelete", function (role) {   
        try{client.settings.remove(role.guild.id, role.id, `djroles`);}catch{}
    });
    client.on("message", async (message) => {
        if(!message.guild) return;
        if(message.author.bot) return;
        client.custom.ensure(message.guild.id, {
            playlists: [],
        });
        client.custom2.ensure(message.author.id, {
            myplaylists: [],
        });
        client.infos.ensure("global", {
            cmds: 0,
            songs: 0,
            filters: 0,
        })
        client.settings.ensure(message.guild.id, {
            prefix: config.Default_Prefix,
            djroles: [],
            playingembed: "",
            playingchannel: "",
            botchannel: [],
        });
        client.custom2.ensure(message.author.id, {
            myplaylists: [],
        });
    });
    const { MessageEmbed } = require("discord.js");
    const { stripIndents } = require("common-tags");

    
    client.on("message", async message => {
        client.custom.ensure(message.guild.id, {
            playlists: [],
        });
        client.custom2.ensure(message.author.id, {
            myplaylists: [],
        });
        client.infos.ensure("global", {
            cmds: 0,
            songs: 0,
            filters: 0,
        })
        client.settings.ensure(message.guild.id, {
            prefix: config.Default_Prefix,
            djroles: [],
            playingembed: "",
            playingchannel: "",
            botchannel: [],
        });
        if (message.author.bot) return;
        if (!message.guild) return;
        //create the database for the OWN user
        client.custom2.ensure(message.author.id, {
            myplaylists: [],
        });

    });
   
    client.on('voiceStateUpdate', (oldState, newState) => {
        if (newState.id === client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false) {
            try {
                const channel = newState.member.guild.channels.cache.find(
                    channel =>
                    channel.type === "text" &&
                    (channel.name.includes("cmd") || channel.name.includes("command") || channel.name.includes("bot")) &&
                    channel.permissionsFor(newState.member.guild.me).has("SEND_MESSAGES")
                );
                channel.send("Don't unmute me!, i muted my self again! This safes Data so it gives you a faster and smoother experience");
                newState.setDeaf(true);
            } catch (error) {
                try {
                    const channel = newState.member.guild.channels.cache.find(
                        channel =>
                        channel.type === "text" &&
                        channel.permissionsFor(newState.member.guild.me).has("SEND_MESSAGES")
                    );
                    channel.send("Don't unmute me!, i muted my self again! This safes Data so it gives you a faster and smoother experience");
                    newState.setDeaf(true);
                } catch (error) {
                    newState.setDeaf(true);
                }
            }
        }
    });
    console.log("Setups Loaded".green)
}