const ayarlar = require ("../ayarlar.json")
const Command = require("../base/Command.js");
class Streamer extends Command {
    constructor(client) {
        super(client, {
            name: "yazılımcı",
            aliases: ["yazılımcı", "coder"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(ayarlar.skill) && !message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Rolü verip/almak istediğin kullanıcıyı belirt ve tekrar dene!", message.author, message.channel)
        if(!user.roles.cache.has(ayarlar.yazılımcı)) {
            await this.client.yolla(`${user} kişisine <@&${ayarlar.yazılımcı}> rolü verildi.`, message.author, message.channel)
            user.roles.add(ayarlar.yazılımcı)
        } else{
            await this.client.yolla(`${user} kişisinden <@&${ayarlar.yazılımcı}> rolü alındı.`, message.author, message.channel)
            user.roles.remove(ayarlar.yazılımcı)
        }
    }
}

module.exports = yazılımcı;