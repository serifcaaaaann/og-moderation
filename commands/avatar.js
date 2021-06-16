const Command = require("../base/Command.js");
const Discord = require("discord.js")
const ayarlar = require ("../ayarlar.json")
class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            aliases: ["av"]
        });
    }

    async run(message, args, data) {
        if(message.channel.id !== ayarlar.botcommandchat) return message.channel.send(`Bu komut sadece <#${ayarlar.botcommandchat}> kanalında kullanılabilir.`)
        let embed = new Discord.MessageEmbed().setAuthor(user.tag).setDescription(`ID: ${user.id}\` ${user.displayAvatarURL({ dynamic: true, size: 4096 })}`)
        let user = args.length > 0 ? message.mentions.users.first() || await this.client.users.fetch(args[0]) || message.author : message.author
        message.channel.send(embed)

    }
}

module.exports = Avatar;
