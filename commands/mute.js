const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
moment.locale("tr")
const tokuchi = require("pretty-ms");
const mutes = require("../models/chatmute.js")
const ayarlar = require ("../ayarlar.json")
const sunucu = require("../models/sunucu-bilgi.js")
const bitmiyor = require("parse-ms")
class Mute extends Command {
    constructor(client) {
        super(client, {
            name: "mute",
            aliases: ["mute"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(ayarlar.mutehammer) && !message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Susturmak istediğin kullanıcıyı bulamadım.", message.author, message.channel)
        if (!args[1] || isNaN(ms(args[1]))) return this.client.yolla("Susturma süresini belirtmelisin.", message.author, message.channel)
        if (ms(args[1]) < ms("1m")) return this.client.yolla("Belirtilen susturma süresi geçerli değil.", message.author, message.channel)
        if (!args[2]) return this.client.yolla("Susturma sebebini belirtmelisin.", message.author, message.channel)
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
        if (user.hasPermission("ADMINISTRATOR")) return this.client.yolla("Yöneticilere ceza-i işlem uygulayamazsın.", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        if (user.roles.cache.has(ayarlar.muted)) return this.client.yolla("Kullanıcı zaten susturulmuş durumda.", message.author, message.channel)
        let time = ms(args[1]);
        let muteTime = time
        let dataTime = await this.client.extraMute(user.id, "chatMute", time)
        muteTime = muteTime + (muteTime * dataTime)
        let cıkaralım = time + Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }));
        let şuanki = moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL");
        let sonraki = moment(cıkaralım).format("LLL");
        let id = await sunucu.findOne({ guild: ayarlar.guildid })
        user.roles.add(ayarlar.muted)
        await message.channel.send(`${this.client.emojis.cache.find(x => x.name == "Susturuldu")} <@${user.id}> kişisi ${await this.client.turkishDate(time)} ${ms(args[1]) < muteTime ? `(\`kullanıcı daha önceden cezalı olduğu için cezasına +${await this.client.turkishDate(muteTime - time)} eklendi.\`) ` : `` }boyunca metin kanallarında susturuldu.`)
        const mutelendı = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("32CD32")
            .setDescription(`${this.client.emojis.cache.find(x => x.name == "Susturuldu")} ${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(muteTime)} boyunca metin kanallarında susturuldu\n\n• Susturulma sebebi: \`${args.slice(2).join(" ")}\`\n• Chat Mute atılma tarihi: \`${şuanki}\`\n• Chat Mute bitiş tarihi: \`${sonraki}\``)
            await this.client.channels.cache.get(ayarlar.mutelog).send(mutelendı)
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + muteTime,
                start: Date.now(),
                sebep: args.slice(2).join(" ")
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Chat Mute",
                sebep: args.slice(2).join(" "),
                tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                bitiş: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" })) + ms(args[1])).format("LLL")
            })
            newData.save().catch(e => console.error(e))
            this.client.savePunishment()
        })
    }
}

module.exports = Mute;
