const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
moment.locale("tr")
const tokuchi = require("pretty-ms");
const mutes = require("../models/voicemute.js")
const sunucu = require("../models/sunucu-bilgi.js")
const wmute = require("../models/waitMute.js")
const ayarlar = require ("../ayarlar.json")
class VMute extends Command {
    constructor(client) {
        super(client, {
            name: "vmute",
            aliases: ["vmute"]
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
        if (user.voice.serverMute == true) return this.client.yolla("Kullanıcı zaten susturulmuş durumda.", message.author, message.channel)
        let time = ms(args[1]);
        let  yes = this.client.emojis.cache.find(x => x.name == "og_yes")
        let no = this.client.emojis.cache.find(x => x.name == "og_no")
        let cıkaralım = time + Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }));
        let şuanki = moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL");
        let sonraki = moment(cıkaralım).format("LLL");
        let id = await sunucu.findOne({ guild: ayarlar.guildid })
        if(user.voice.channel) {
        user.voice.setMute(true)
        await message.channel.send(`${this.client.emojis.cache.find(x => x.name == "Susturuldu")} <@${user.id}> kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu.`)
        const mutelendı = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("32CD32")
            .setDescription(`${this.client.emojis.cache.find(x => x.name == "Susturuldu")} ${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu\n\n• Susturulma sebebi: \`${args.slice(2).join(" ")}\`\n• Ses Mute atılma tarihi: \`${şuanki}\`\n• Ses Mute bitiş tarihi: \`${sonraki}\``)
            await this.client.channels.cache.get(ayarlar.mutelog).send(mutelendı)
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + ms(args[1]),
                start: Date.now(),
                sebep: args.slice(2).join(" ")
            })
            newMute.save().catch(e => console.log(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await message.channel.send(`${client.emojis.cache.find(x => x.name == "Susturuldu")} ${no} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak.`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: args.slice(2).join(" "),
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return message.channel.send(`${client.emojis.cache.find(x => x.name == "Susturuldu")} ${no} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
            await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                const newData = new data({
                    user: user.id,
                    yetkili: message.author.id,
                    ihlal: id + 1,
                    ceza: "Voice Mute",
                    sebep: args.slice(2).join(" "),
                    tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                    bitiş: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" })) + ms(args[1])).format("LLL")
                })
                newData.save().catch(e => console.error(e))
                this.client.savePunishment()
            })
        }
        })
    }
    }
}

module.exports = VMute;
