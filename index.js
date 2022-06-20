const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const https = require('https');
const fs = require("fs");
const { url } = require("inspector");
const config = require("./app.json")
const discordModals = require('discord-modals');
const { timeStamp } = require("console");
const { sensitiveHeaders } = require("http2");
const mdb = require("maces_database")
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
    console.log('Duckland is landed!')
    client.user.setStatus("quack quack quack I'm duck quack") 
})

client.on('guildMemberAdd', member => {
    var role = member.guild.roles.cache.find(role => role.id == "988171755455643648")
    member.roles.add(role);
});

client.on("messageCreate", (message) => {
    /*if(message.author.bot) return;
    if(!message.content.startsWith(prefix));

    let [cmdname, ...cmdargs] = message.content.slice(prefix.length).trim().split(' ');
    */

    if(!message.content.startsWith(prefix) || message.author.bot);
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase();

    if (command === 'clear') {
        if (message.member.roles.cache.has('988127945749057557') || message.member.roles.cache.has('988170630014849194') || message.member.roles.cache.has('988170895963078687')) {        

            if (!args.length) {
                const embed = new MessageEmbed()
                .setColor(null)
                .setDescription("ltfn sayı girin :).")
                message.react("👎")
                message.channel.send(args[0])
                message.reply({ content: null, embeds: [embed]});
            } else if (args[0] != 0) {
                try {
                    let deletingMessageN = args[0];
                    
                    message.channel.bulkDelete(deletingMessageN);
                    const embed = new MessageEmbed()
                    .setColor(null)
                    .setDescription(`${deletingMessageN} kadar mesaj silindi.`)
                    message.react("👎")
                    message.reply({ content: null, embeds: [embed]});
                } catch(e) {
                    message.channel.bulkDelete(deletingMessageN);
                    const embed = new MessageEmbed()
                    .setColor(null)
                    .setDescription(`You cannot delete more than 100 messages.`)
                    message.react("👎")
                    message.reply({ content: null, embeds: [embed]});
                }
            }

            
        } else {
            const embed = new MessageEmbed()
            .setColor(null)
            .setAuthor("Permission Error.")
            .setDescription("To do this, you must have the *BEFOM, Admin, Mod* roles.")
            message.react("👍")
            message.reply({ content: null, embeds: [embed]});
        }
    }

    // help

    if (command === "help") {
        const help = new MessageEmbed()
        .setColor(null)
        .setTitle("Help Commands (Moderation)")
        .setDescription("")
        .setColor(null)
        .addFields(
            { name: '> Queue', value: '!queue' },
            { name: '> Online Players', value: '!online' },
            { name: '> All Players', value: '!allplayers' },
            { name: '> Townless Players', value: '!townless' },
            { name: '> Resident Info', value: '!resident info _name_' },
            { name: '> Town Info', value: '!town info _name_' },
            { name: '> Nation Info', value: '!nation info _name_' },
            { name: ' ', value: ' ' },
            { name: 'Duckland Commands', value: ' ' },
            { name: '> Online Players', value: '!d online' },
            { name: '> All Players', value: '!d allplayers' },

        )
        message.react("👍")

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
        message.react("👍")

        if (!args.length) {
            message.reply({ content: null, embeds: [help]});
        } else if (args[0] === "mod") {
            message.reply({ content: null, embeds: [helpModeration]});
        }
    }    
    
    // enableRegister

    if (command === 'enableRegister') {
        if (message.member.roles.cache.has('988127945749057557') || message.member.roles.cache.has('988170630014849194') || message.member.roles.cache.has('988170895963078687')) {
            regV = 1;
            mdb.addData("regV", 1, "app.json")

            const embed = new MessageEmbed()
            .setColor(null)
            .setDescription("The registration system has been successfully activated.")
            message.react("👍")
            message.reply({ content: null, embeds: [embed]});
        } else {
            const embed = new MessageEmbed()
            .setColor(null)
            .setAuthor("Permission Error.")
            .setDescription("To do this, you must have the *BEFOM, Admin, Mod* roles.")
            message.react("👎")
            message.reply({ content: null, embeds: [embed]});
        }

    }

    // disableRegister

    if (command === 'disableRegister') {
        if (message.member.roles.cache.has('988127945749057557') || message.member.roles.cache.has('988170630014849194') || message.member.roles.cache.has('988170895963078687')) {
            regV = 0;
            mdb.addData("regV", 0, "app.json")

            const embed = new MessageEmbed()
            .setColor(null)
            .setDescription("The registration system has been successfully deactivated.")
            message.react("👍")
            message.reply({ content: null, embeds: [embed]});

        } else {
            const embed = new MessageEmbed()
            .setColor(null)
            .setAuthor("Permission Error.")
            .setDescription("To do this, you must have the *BEFOM, Admin, Mod* roles.")
            message.react("👍")
            message.reply({ content: null, embeds: [embed]});
        }
    }

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
                        if (json_data["nation"] == "Russian_Empire") {
                            if (json_data["rank"] == "Mayor") {
                                const embed = new MessageEmbed()
                                .setColor(null)
                                .setAuthor("You are a Duckland member.")
                                .setDescription("We heard that he is the mayor of the village **" + json_data["town"] +"**. \n\n For this I will give you the role of **Mayor**.")
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
                            }
                            if (json_data["rank"] == "Resident") {
                                const embed = new MessageEmbed()
                                .setColor(null)
                                .setAuthor("You are a Duckland member.")
                                .setDescription("We heard that there is someone living in the village of **" + json_data["town"] +"**. \n\n For this I will give you the role of **Citizen**.")
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
                            }
    
                        } else {            
                            if (json_data["nation"] == "No Nation") {
                                const embed = new MessageEmbed()
                                .setColor(null)
                                .setAuthor("You are not a Duckland member.")
                                .setDescription("We heard you are from **" + json_data["town"] + "** village! \n\n That's why we gave you the role of **Other**!")
                                message.react("👍")
                                message.reply({ content: null, embeds: [embed]});
                            } else {
                                const embed = new MessageEmbed()
                                .setColor(null)
                                .setAuthor("You are not a Duckland member.")
                                .setDescription("We heard you are from **" + json_data["town"] + "** village, **" + json_data["nation"] + "**! \n\n That's why we gave you the role of **Other**!")
                                message.react("👍")
                                message.reply({ content: null, embeds: [embed]});
                            }
    
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
                        }
    
                    } else {
                        const embed = new MessageEmbed()
                        .setColor(null)
                        .setAuthor("We had a problem casting your role. Please overhaul your username or information..")
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
