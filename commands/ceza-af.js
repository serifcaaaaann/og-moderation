const Command = require("../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../models/cezalı.js")
const ceza = require("../models/cezalar.js")
const moment = require("moment")
require("moment-duration-format")
const ayarlar = require ("../ayarlar.json")
class Af extends Command {
    constructor(client) {
        super(client, {
            name: "af",
            usage: "erkek",
            aliases: ["unjail", "cezalı-af"]
        });
    }

    async run(message, args, level) {
        if (!message.member.roles.cache.has(ayarlar.jailhammer) && !message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Cezalısını kaldırmak istediğin kullanıcıyı belirt.", message.author, message.channel)
        await cezalar.findOne({ user: user.id }, async (err, doc) => {
            if (!doc) return this.client.yolla("<@" + user + "> veritabanında cezalı olarak bulunmuyor.", message.author, message.channel)
            if (doc.ceza == false) return this.client.yolla("<@" + user + "> veritabanında cezalı olarak bulunmuyor.", message.author, message.channel)
            if (message.author.id !== doc.yetkili && !message.member.hasPermission("ADMINISTRATOR")) return this.client.yolla("❌ Cezalı af işlemini sadece kişiyi cezalıya atan yetkili(<@" + doc.yetkili + ">) veya yönetici yetkisine sahip kişi(ler) gerçekleştirebilir.", message.author, message.channel)
            user.roles.set(doc.roller)
            doc.delete().catch(e => console.log(e))
            this.client.yolla("<@" + user + "> kişisinden cezalı rolü alındı ve eski rolleri geri verildi.", message.author, message.channel)
        })
    }
}

module.exports = Af;
