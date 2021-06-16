const Command = require("../base/Command.js");
const Discord = require("discord.js")
const ayarlar = require ("../ayarlar.json")
class Komutlar extends Command {
    constructor(client) {
        super(client, {
            name: "komutlar",
            aliases: ["komutlar"]
        });
    }

    async run(message, args, data) {
        if (!message.member.roles.cache.has(ayarlar.genelyetkili) && !message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        .setColor("RANDOM")
        .setDescription(`${this.client.commands.map(x => `- \`\`${x.help.name}\`\``).join("\n")}`)
        message.channel.send(embed)
    }
}

module.exports = Komutlar;
