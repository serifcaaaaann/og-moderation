const Command = require("../base/Command.js");
const Discord = require("discord.js");
const ayarlar = require ("../ayarlar.json")
class Toplantı extends Command {
    constructor(client) {
        super(client, {
            name: "yoklama",
            aliases: ["yoklama"]
        });
    }

    async run(message, member, args, level) {
        if (!message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        message.channel.send(""+this.client.ok+" Odadaki yetkililere katıldı permi veriliyor. Bu işlem uzun sürebilir.")
        let toplantıdaOlanlarx = message.member.voice.channel.members.filter(x => {
            return x.roles.cache.has(ayarlar.jail)
        }).map(x => x.id)
        for (let i = 0; i < toplantıdaOlanlarx.length; i++) {
            setTimeout(() => {
                message.guild.members.cache.get(toplantıdaOlanlarx[i]).roles.add(ayarlar.katıldı)
            }, (i + 1) * 1000)
        }
        message.channel.send("Odadaki tüm yetkililere katıldı permi başarıyla verildi.")

    }
}
module.exports = Toplantı