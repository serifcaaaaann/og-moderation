const Command = require("../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
const cezalar = require("../models/cezalar.js")
const Discord = require("discord.js")
const ayarlar = require ("../ayarlar.json")
const data = require("../models/cezalar.js")
const sunucu = require("../models/sunucu-bilgi.js")
class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            aliases: ["ban"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(ayarlar.banhammer) && !message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        if (args.length < 1) return this.client.yolla("Bir kullanıcı etiketleyin veya kullanıcı ID giriniz.", message.author, message.channel)
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Belirttiğiniz kullanıcı geçerli değil.", message.author, message.channel)
        if(user.id === message.author.id) return this.client.yolla("Kendi kendini banlayamazsın.", message.author, message.channel)
        if (message.guild.members.cache.has(user.id) && message.guild.members.cache.get(user.id).hasPermission("VIEW_AUDIT_LOG")) return this.client.yolla("Üst yetkiye sahip kişileri yasaklayamazsın!", message.author, message.channel)
        if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        let reason = args.slice(1).join(" ") || "Sebep Belirtilmedi."
        let id = await sunucu.findOne({ guild: ayarlar.guildid })
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setDescription(`**${user.tag}** kullanıcısı başarıyla sunucudan yasaklandı.`)
            const banlandi = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("32CD32")
            .setDescription(`${"<@" + user.id + ">"} kullanıcısı sunucudan ${reason} sebebiyle yasaklandı.`)
        message.guild.fetchBans(true).then(async (bans) => {
            let ban = await bans.find(a => a.user.id === user.id)
            if (ban) return this.client.yolla(`**${user.tag}** kullanıcısı zaten yasaklanmış durumda.`, message.author, message.channel)
            if (!ban) {
                let banNum = this.client.banLimit.get(message.author.id) || 0
                this.client.banLimit.set(message.author.id, banNum + 1)
                if (banNum == 5) return this.client.yolla("Gün içerisinde çok fazla ban işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
                await message.guild.members.ban(user.id, { reason: `${reason} | Yetkili: ${message.author.tag}` })
                await message.channel.send(embed)
                await this.client.channels.cache.get(ayarlar.banlog).send(banlandi)
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Yasaklı",
                        sebep: reason,
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            }
        })
    }
}

module.exports = Ban;
