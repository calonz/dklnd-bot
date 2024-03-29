const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const https = require('https');
const fs = require("fs");
const { url } = require("inspector");
const config = require("./app.json")
const discordModals = require('discord-modals');
const { timeStamp } = require("console");
const { sensitiveHeaders } = require("http2");
const mdb = require("maces_database");
const { triggerAsyncId } = require("async_hooks");
const { Modal, TextInputComponent, showModal, MessageActionRow} = discordModals;
var regV = config.regV;
var prefix = config.prefix;
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
});

discordModals(client);

client.on("ready", () => {
    console.log('Duckbot is landed!')

    const guildIdE = '988126058215772230';
    const guildE = client.guilds.cache.get(guildIdE)

    if (guildE) {
        commands = guildE.commands
    } else {
        commands = client.application?.commands
    }

    commands.create({
        name: "help",
        description: 'Get help commands.'
    })
    commands.create({
        name: 'alliance',
        description: 'Get Alliance information about the nation',
        options: [
            {
                name: 'nation',
                description: 'Nation to be found',
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })
    commands.create({
        name: 'online',
        description: 'Get player online status',
        options: [
            {
                name: 'nickname',
                description: 'Player nickname',
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })

    commands.create({
        name: 'server',
        description: 'Get server status.',
    })

    client.user.setActivity("www.macesdev.net/contact");
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }
        
    const { commandName, Options } = interaction
        
    if (commandName == "help") {
        const help = new MessageEmbed()
        .setColor(null)
        .setTitle("Help Commands")
        .setDescription("" + 
        "```Server Status     | /server \n" + 
        "Online Players    | /online <name> \n" +
        "Alliance Info     | /alliance <name>``` \n" )
        .setColor(null)
        .setFooter({ text: '© 2022 macesdev foundation, Inc.'})

        const helpModeration = new MessageEmbed()
        .setColor(null)
        .setTitle("Help Commands (Moderation)")
        .setDescription("")
        .setColor(null)
        .addFields(
            { name: '> Clear Commands', value: '!clear _number_' },
            { name: '> Enable Register System', value: '!enableRegister' },
            { name: '> Disable Register System', value: '!disableRegister' }
        )
        .setFooter({ text: '© 2022 macesdev foundation, Inc.'})
        interaction.reply({content: null, embeds: [help], ephemeral: false})
    }  
    if (commandName == "alliance") {
        try {
            let discordInvite = null;
            let imageURL = null;
            let meganation = null;
            let leaderName = null;
            let online = null;
            let towns = null;
            let alliancename = null;
            let area = null;
            let nations = null;
            let rank = null;
            let residentN = null;

            let apiLink = "https://earthmc-api.herokuapp.com/api/v1/aurora/alliances/" + interaction.options.getString('nation');
            let req = https.get(apiLink, function(res) {
                let data = '',
                json_data;

            res.on('data', function(stream) {
                data += stream;
            });
            res.on('end', function() {
                const json_data = JSON.parse(data);
                
                discordInvite = json_data["discordInvite"]
                imageURL = json_data["imageURL"]          
                leaderName = json_data["leaderName"]
                online = json_data["online"]
                towns = json_data["towns"]
                alliancename = json_data["allianceName"]
                area = json_data["area"]
                nations = json_data["nations"]
                rank = json_data["rank"]
                residentN = json_data["residents"]

                meganation = json_data["meganation"]
                if (meganation == true) {
                    meganation = ":thumbsup:"
                } else {
                    meganation = ":thumbsdown:"
                }

                if (discordInvite == "No discord invite has been set for this alliance") {
                    discordInvite = "No invite link found!"
                }

                const embed = new MessageEmbed()
                .setTitle('Alliance ' + `${alliancename}`)
                .setDescription('Information about the ' + `${alliancename}` + ' alliance.')
                .setColor(null)
                .addFields(
                    { name: 'Discord Invite', value:  "```" + `${discordInvite}` + "```"},
                    { name: 'Leader Name', value: "```" + `${leaderName}` + "```", inline: true},
                    { name: 'Alliance Name', value: "```" + `${alliancename}` + "```", inline: true},
                    { name: 'Residents', value: "```" + `${residentN}` + "```", inline: true },
                    { name: 'Towns', value: "```" + `${towns}` + "```", inline: true},
                    { name: 'Area', value: "```" + `${area}` + "```", inline: true},
                    { name: 'Rank', value: "```" + `${rank}` + "```", inline: true},
                    { name: 'Online', value: "```" + `${online}` + "```"},
                    { name: 'Nations', value: "```" + `${nations}` + "```"},
                )
                .setFooter({ text: '© 2022 macesdev foundation, Inc.'})
                .setThumbnail(imageURL)

                interaction.reply({content: null, embeds: [embed], ephemeral: false})
            });
            });
            } catch(e) {
                const embed = new MessageEmbed()
                .setColor(null)
                .setAuthor("There was a problem communicating with the server.");
                interaction.reply({content: null, embeds: [embed], ephemeral: false})
            }
    }
    if (commandName == "online") {
        try {
            let status = null;

            let apiLink = "https://earthmc-api.herokuapp.com/api/v1/aurora/onlineplayers/" + interaction.options.getString('nickname');
            let req = https.get(apiLink, function(res) {
                let data = '',
                json_data;

            res.on('data', function(stream) {
                data += stream;
            });
            res.on('end', function() {
                const json_data = JSON.parse(data);
                
                status = json_data

                const online = new MessageEmbed()
                .setTitle(interaction.options.getString('nickname'))
                .setDescription('🟢 This player is currently online!')
                .setColor(null)
                .setFooter({ text: '© 2022 macesdev foundation, Inc.'})

                const offline = new MessageEmbed()
                .setTitle(interaction.options.getString('nickname'))
                .setDescription('🔴 This player is currently offline!')
                .setColor(null)
                .setFooter({ text: '© 2022 macesdev foundation, Inc.'})

                console.log(json_data)

                if (json_data == "That player is offline or does not exist!") {
                    interaction.reply({content: null, embeds: [offline], ephemeral: false})
                } else {
                    interaction.reply({content: null, embeds: [online], ephemeral: false})
                }

            });
            });
            } catch(e) {
                const embed = new MessageEmbed()
                .setColor(null)
                .setAuthor("There was a problem communicating with the server.");
                interaction.reply({content: null, embeds: [embed], ephemeral: false})
            }
    }
    if (commandName == "server") {
        try {
            let onlineStatus = null;
            let queue = null;
            let online = null; 
            let maxPlayers = null;
            let auroraPlayers = null;
            let novaPlayers = null;

            let apiLink = "https://earthmc-api.herokuapp.com/api/v1/serverinfo";
            let req = https.get(apiLink, function(res) {
                let data = '',
                json_data;

            res.on('data', function(stream) {
                data += stream;
            });
            res.on('end', function() {
                const json_data = JSON.parse(data);
                if (json_data["serverOnline"] == true) {
                    onlineStatus = "✅"
                } else {
                    onlineStatus = "Offline"
                }
                queue = json_data["queue"]
                online = json_data["online"]
                maxPlayers = json_data["max"]
                novaPlayers = json_data["nova"]
                auroraPlayers = json_data["aurora"]

                if (onlineStatus == undefined || queue == undefined || online == undefined || maxPlayers == undefined || novaPlayers == undefined || auroraPlayers == undefined) {
                    const embed = new MessageEmbed()
                    .setColor(null)
                    .setAuthor("There was a problem communicating with the server.")
                    interaction.reply({ content: null, embeds: [embed]});
                } else {
                    const embed = new MessageEmbed()
                    .setTitle("Server Status")
                    .setColor(null)
                    .setDescription("It gives information about the activity of the server." +
                    `\n\n**Online ** | ${onlineStatus}`+
                    `\n**Players in Queue** | ${queue}` +
                    `\n\n**Total Players** | ${maxPlayers}/450` +
                    `\n**Aurora Players** | ${auroraPlayers}/250 (${250-auroraPlayers} Free Plots!)`+
                    `\n**Nova Players** | ${novaPlayers}/200 (${200-novaPlayers} Free Plots!)`)
                    .setFooter({ text: '© 2022 macesdev foundation, Inc.'})
                    interaction.reply({ content: null, embeds: [embed]});   
                }
            });
            });
            } catch(e) {

            }
    }
})

client.on('guildMemberAdd', member => {
    var role = member.guild.roles.cache.find(role => role.id == "988171755455643648")
    member.roles.add(role);
});

client.on("messageCreate", (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot);
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase();

    /*if (command == "nation") {
        if (!args.length) {
            const embed = new MessageEmbed()
            .setColor(null)
            .setAuthor("Please specify a nation.")
            message.channel.send({ content: null, embeds: [embed]});
        } else if (args[0] != undefined) {
            try {
                let nationName = null;
                let residents = null;
                let towns = null;
                let king = null;
                let capitalTown = null;
                let capitalX = null;
                let capitalZ = null;
                let area = null;
    
                let apiLink = "https://earthmc-api.herokuapp.com/api/v1/aurora/nations/" + args[0];
                let req = https.get(apiLink, function(res) {
                    let data = '',
                    json_data;
    
                res.on('data', function(stream) {
                    data += stream;
                });
                res.on('end', function() {
                    const json_data = JSON.parse(data);
                    
                    nationName = json_data["name"]
                    residents = json_data["residents"]
                    towns = json_data["towns"]
                    king = json_data["king"]
                    capitalTown = json_data["capitalName"]
                    capitalX = json_data["capitalX"]
                    capitalZ = json_data["capitalZ"]
                    area = json_data["area"]
                    
                    const embed = new MessageEmbed()
                    .setColor(null)
                    .setTitle(`${nationName} + (Nation)`)
                    .setColor(null)
                    .addFields(
                        { name: 'Leader Player', value:  "```" + `${king}` + "```", inline: true},
                        { name: 'Capitial Town', value: "```" + `${capitalTown}` + "```", inline: true},
                        { name: 'Claimed Chunks', value: "```" + `${area}` + "```", inline: true },
                        { name: 'Online Residents', value: "```" + `${online}` + "```"},
                        { name: 'Claimed Chunks', value: "```" + `${area}` + "```"},
                    )

                    message.channel.send({ content: null, embeds: [embed]});
                });
                });
                } catch(e) {
                    const embed = new MessageEmbed()
                    .setColor(null)
                    .setAuthor("There was a problem communicating with the server.")
                    message.channel.send({ content: null, embeds: [embed]});
                }
        }
    }*/

    /*if (command == "alliance") {
        if (!args.length) {
            const embed = new MessageEmbed()
            .setColor(null)
            .setAuthor("Please specify a nation.")
            message.channel.send({ content: null, embeds: [embed]});
        } else if (args[0] != undefined) {

        }
    }*/

    if (regV == 1) {
        if (message.author.id != "988138661059104778") {
            if (message.channel.id == "988126059079802912"){
                let userValueURL = "https://earthmc-api.herokuapp.com/api/v1/aurora/allplayers/" + message.content + "/";
                let req = https.get(userValueURL, function(res) {
                    let data = '',
                    json_data;
    
                res.on('data', function(stream) {
                    data += stream;
                });
                res.on('end', function() {
                    const json_data = JSON.parse(data);
    
                    if (json_data["name"] != undefined) {

                        if (json_data["rank"] == "Nation Leader") {
                            const embed = new MessageEmbed()
                            .setColor(null)
                            .setTitle("Welcome Angola Discord Server!")
                            .setDescription("We saw that he was the **leader** of the nation of **" + json_data["nation"] +"**. \n That's why we're going to give you the role of **Mation Leader**.")
                            message.react("👍")
                            message.reply({ content: null, embeds: [embed]});

                            message.guild.roles.fetch()
                            let role = message.guild.roles.cache.find(role => role.id === '989556174972149760')
                            message.member.roles.add(role)
                            let roleUr = message.guild.roles.cache.find(role => role.id === '988171755455643648')
                            message.member.roles.remove(roleUr)

                            const embedInput = new MessageEmbed()
                            .setColor(null)
                            .setDescription(`<@${message.author.id}>, the nation leader of the **` + json_data["nation"] + `**, joined us!`)

                            const channel = client.channels.cache.get('988359360554094653');
                            channel.send({ content: null, embeds: [embedInput]});

                            try {
                                const guild = client.guilds.cache.get("988126058215772230");
                                const memberTarget = guild.members.cache.get(message.author.id);
                                memberTarget.setNickname(message.content + " | " + json_data["nation"])
                            } catch {
                                // :flushed: ehehehe
                            }
                        }
                        if (json_data["rank"] == "Mayor") {
                            const embed = new MessageEmbed()
                            .setColor(null)
                            .setTitle("Welcome Angola Discord Server!")
                            .setDescription("We saw that he was the mayor of the village **" + json_data["town"] +"**. \n That's why we're going to give you the role of **Mayor**.")
                            message.react("👍")
                            message.reply({ content: null, embeds: [embed]});

                            message.guild.roles.fetch()
                            let role = message.guild.roles.cache.find(role => role.id === '988172344717627503')
                            message.member.roles.add(role)
                            let roleUr = message.guild.roles.cache.find(role => role.id === '988171755455643648')
                            message.member.roles.remove(roleUr)

                            const embedInput = new MessageEmbed()
                            .setColor(null)
                            .setDescription(`<@${message.author.id}>, the mayor of the **` + json_data["town"] + `** village, joined us!`)

                            const channel = client.channels.cache.get('988359360554094653');
                            channel.send({ content: null, embeds: [embedInput]});

                            try {
                                const guild = client.guilds.cache.get("988126058215772230");
                                const memberTarget = guild.members.cache.get(message.author.id);
                                memberTarget.setNickname(message.content + " | " + json_data["nation"])
                            } catch {
                                // :flushed: ehehehe
                            }
                        }
                        if (json_data["rank"] == "Resident") {
                            const embed = new MessageEmbed()
                            .setColor(null)
                            .setTitle("Welcome Angola Discord Server!")
                            .setDescription("We saw that there is someone living in the village **" + json_data["town"] +"**. \n That's why we're going to give you the role of **Resident**.")
                            message.react("👍")
                            message.reply({ content: null, embeds: [embed]});

                            message.guild.roles.fetch()
                            let role = message.guild.roles.cache.find(role => role.id === '988174107210301500')
                            message.member.roles.add(role)
                            let roleUr = message.guild.roles.cache.find(role => role.id === '988171755455643648')
                            message.member.roles.remove(roleUr)

                            const embedInput = new MessageEmbed()
                            .setColor(null)
                            .setDescription(`<@${message.author.id}>, the resident of the **` + json_data["town"] + `** village, joined us!`)

                            const channel = client.channels.cache.get('988359360554094653');
                            channel.send({ content: null, embeds: [embedInput]});

                            try {
                                const guild = client.guilds.cache.get("988126058215772230");
                                const memberTarget = guild.members.cache.get(message.author.id);
                                memberTarget.setNickname(message.content + " | " + json_data["nation"])
                            } catch {
                                // :flushed: ehehehe
                            }
                        }

                        if (json_data["nation"] == "No Nation") {
                            const embed = new MessageEmbed()
                            .setColor(null)
                            .setTitle("Welcome Angola Discord Server!")
                            .setDescription("We saw you are from **" + json_data["town"] + "** village! \n That's why we gave you the role of **Resident**!")
                            message.react("👍")
                            message.reply({ content: null, embeds: [embed]});

                            message.guild.roles.fetch()
                            let role = message.guild.roles.cache.find(role => role.id === '988184638780493864')
                            message.member.roles.add(role)             
                            let roleUr = message.guild.roles.cache.find(role => role.id === '988171755455643648')
                            message.member.roles.remove(roleUr)

                            const embedInput = new MessageEmbed()
                            .setColor(null)
                            .setDescription(`<@${message.author.id}> from the village **` + json_data["town"] + `** came.`)
                            const channel = client.channels.cache.get('988359360554094653');
                            channel.send({ content: null, embeds: [embedInput]});

                            try {
                                const guild = client.guilds.cache.get("988126058215772230");
                                const memberTarget = guild.members.cache.get(message.author.id);
                                memberTarget.setNickname(message.content + " | " + json_data["nation"])
                            } catch {
                                // :flushed: ehehehe
                            }
                        } 
                    } else {
                        const embed = new MessageEmbed()
                        .setColor(null)
                        .setDescription("We had a problem casting your role. Please overhaul your username or information..")
                        message.channel.send({ content: null, embeds: [embed]});
                    }
                });
            });
            }
        }
    } else {

    }
})

client.login("OTg4MTM4NjYxMDU5MTA0Nzc4.G5XjHq.HsCnJgHSwNTJ4iAtZSkAJDiFuDo3EK2L2ubGBI")
