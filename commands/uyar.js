const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const uyarılar = require("../models/uyar.js")
const ms = require("ms")
const moment = require("moment")
const sunucu = require("../models/sunucu-bilgi")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
const uyar = require("../models/uyar.js");
const ayarlar = require ("../ayarlar.json")
class Uyar extends Command {
    constructor(client) {
        super(client, {
            name: "uyar",
            aliases: ["uyar"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.has(ayarlar.warnhammer) && !message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Uyarmak istediğin kullanıcyı belirtmelisin", message.author, message.channel)
        let sebep = args.slice(1).join(" ")
        if(!sebep) return this.client.yolla("Kullanıcının uyarı sebebini belirtmelisin.", message.author, message.channel)
        let id = await sunucu.findOne({ guild: ayarlar.guildid })
        uyarılar.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                let arr = []
                arr.push({mod: message.author.id, sebep: sebep, tarih: Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))})
                const newWarn = new uyarılar({
                    user: user.id,
                    uyarılar: arr
                })
                newWarn.save().catch(e => console.log(e))
                user.roles.add(ayarlar.uyarı1)
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Uyarı",
                        sebep: sebep,
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
                message.channel.send(`${client.emojis.cache.find(x => x.name == "cezalandirildi")} ${user} kişisine **${sebep}** sebebiyle ilk uyarısı verildi.Kullanıcının ceza puanı \`${await this.client.punishPoint(user.id)}\` oldu.`)
            } else {
                res.uyarılar.push({mod: message.author.id, sebep: sebep, tarih: Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))})
                res.save().catch(e => console.log(e))
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Uyarı",
                        sebep: sebep,
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
                if(res.uyarılar.length == 2) {
                    message.channel.send(`${client.emojis.cache.find(x => x.name == "cezalandirildi")} ${user} kişisine **${sebep}** sebebiyle 2. uyarısı verildi.Kullanıcının ceza puanı \`${await this.client.punishPoint(user.id)}\` oldu.`)
                    user.roles.remove(ayarlar.uyarı1)
                    user.roles.add(ayarlar.uyarı2)
                }
                if(res.uyarılar.length == 3) {
                    message.channel.send(`${client.emojis.cache.find(x => x.name == "cezalandirildi")} ${user} kişisine **${sebep}** sebebiyle 3. uyarısı verildi.Kullanıcının ceza puanı \`${await this.client.punishPoint(user.id)}\` oldu.`)
                    user.roles.remove(ayarlar.uyarı2)
                    user.roles.add(ayarlar.uyarı3)
                }

            }

        })
      
    }
}

module.exports = Uyar;
