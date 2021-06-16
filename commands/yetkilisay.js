const Command = require("../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../models/cezalı.js")
const ayarlar = require ("../ayarlar.json")

class Yetkilisay extends Command {
    constructor(client) {
        super(client, {
            name: "yetkilisay",
            aliases: ["ysay", "yetkili-say"]
        });
    }


    async run(message, args, level) {
        if (!message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) &&  !message.member.hasPermission("ADMINISTRATOR")) return
            let roles = args.length > 0 ? message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) : message.guild.roles.cache.find(x => x.id == ayarlar.genelyetkili)
            let üyeler = message.guild.members.cache.filter(x => {
                return x.roles.cache.has(roles.id) && !x.voice.channel && x.user.presence.status !== "offline"
            })
            message.channel.send("Online olup seste olmayan <@&"+roles.id+"> rolündeki yetkili sayısı: " + üyeler.size + "")
            if(üyeler.size == 0) return
            message.channel.send("```" + üyeler.map(x => "<@" + x.id + ">").join(",") + "```")
    }
}

module.exports = Yetkilisay
