const Command = require("../base/Command.js");
const Discord = require("discord.js")
const ayarlar = require ("../ayarlar.json")
class Gönder extends Command {
    constructor(client) {
        super(client, {
            name: "gönder",
            aliases: ["gönder","taşı"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let member = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!member) return this.client.yolla("Kanala göndermek istediğin kullanıcıyı düzgünce belirt ve tekrar dene !", message.author, message.channel)
        if (!member.voice.channel) return this.client.yolla("Kanala göndermek istediğin kişi bir ses kanalına bağlı değil.", message.author, message.channel)
        if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) return this.client.yolla("Rolleri senden yüksek birine sese gönderme işlemi uygulayamazsın.", message.author, message.channel)
        if (!args[1]) return this.client.yolla("Göndermek istediğin kanalı belirt ve tekrar dene !", message.author, message.channel)
        let kanal = message.guild.channels.cache.find(x => x.id == args[1])
        if(!kanal) return this.client.yolla("Göndermek istediğin kanal hatalı !", message.author, message.channel)
        if(!kanal.permissionsFor(member).has("CONNECT")) return this.client.yolla("Kanala taşımak istediğin üyenin kanala bağlanma yetkisi bulunmuyor.", message.author, message.channel)
        member.voice.setChannel(kanal.id);
        await this.client.yolla(" <@" + member.id + "> başarıyla " + kanal.name + " kanalına gönderildi.", message.author, message.channel)
    }
}

module.exports = Gönder;
