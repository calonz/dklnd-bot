const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const https = require('https');
const fs = require("fs");
const { url } = require("inspector");
const discordModals = require('discord-modals');
const { timeStamp } = require("console");
const { Modal, TextInputComponent, showModal, MessageActionRow} = discordModals;
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
    console.log("gelen var")


    var role = member.guild.roles.cache.find(role => role.id == "988171755455643648")
    member.roles.add(role);
});

client.on("messageCreate", (message) => {
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
                    if (json_data["nation"] == "Yugoslavia") {
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
                    }

                } else {
                    const embed = new MessageEmbed()
                    .setColor(null)
                    .setAuthor("We had a problem casting your role. Please overhaul your username or information..")
                    message.react("👎")
                    message.reply({ content: null, embeds: [embed]});
                }
	        });
        });
        }
    }

})

client.login("OTg4MTM4NjYxMDU5MTA0Nzc4.G5XjHq.HsCnJgHSwNTJ4iAtZSkAJDiFuDo3EK2L2ubGBI")
