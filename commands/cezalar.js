const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
const ayarlar = require ("../ayarlar.json")
class Cezalar extends Command {
    constructor(client) {
        super(client, {
            name: "cezalar",
            aliases: ["cezalar"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(ayarlar.genelyetkili) && !message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Ceza bilgilerine bakmak istediğin kullanıcyı belirtmelisin", message.author, message.channel)
        await data.find({ user: user.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
            if(!res) return this.client.yolla(`${user} kullanıcısının ceza bilgisi bulunmuyor.`, message.author, message.channel)
            let datax = [
                ["Tarih", "Ceza", "Sebep"]
            ];

            let dataxe = [
                ["Ceza", "Tarih", "Bitiş", "Yetkili", "Sebep"]
            ];

            let config = {
                border: {
                    topBody: ``,
                    topJoin: ``,
                    topLeft: ``,
                    topRight: ``,

                    bottomBody: ``,
                    bottomJoin: ``,
                    bottomLeft: ``,
                    bottomRight: ``,

                    bodyLeft: `│`,
                    bodyRight: `│`,
                    bodyJoin: `│`,

                    joinBody: ``,
                    joinLeft: ``,
                    joinRight: ``,
                    joinJoin: ``
                }
            };
            res.map(x => {
                datax.push([x.tarih, x.ceza, x.sebep])
            })

            res.map(x => {
                dataxe.push([x.ceza, x.tarih, x.bitiş, this.client.users.cache.get(x.yetkili).tag, x.sebep])
            })

            let out = table(dataxe, config)
            let outi = table(datax.slice(0, 15), config)
            message.channel.send("<@" + user.id + "> kullanıcısının toplam " + datax.length + " cezası bulunmakta son 15 ceza aşağıda belirtilmiştir.Tüm ceza bilgi dosyasını indirmek için 🚫 emojisine, ceza sayılarına bakmak için ❔ emojisine basabilirsin.Tekli bir cezaya bakmak için ``.ceza ID`` komutunu uygulayınız. ```" + outi + "``` ").then(msg => {
                msg.react("🚫").then(async(r) => {
                    await msg.react('❔');
                });
                msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '🚫' || reaction.emoji.name == '❔'),
                    { max: 1, time: 30000 }).then(async collected => {
                        if (collected.first().emoji.name == '🚫') {
                            message.channel.send(`${user} kullanıcısının toplam ${datax.length} cezası aşağıdaki belgede yazmaktadır.`, { files: [{ attachment: Buffer.from(out), name: `${user.user.username}_cezalar.txt` }] }).then(msg => {
                                msg.delete({ timeout: 5000 })
                            })
                        } else {
                            let filterArr = res.map(x => (x.ceza))
                            let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
                            let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
                            let jail = filterArr.filter(x => x == "Karantina").length || 0
                            let ban = filterArr.filter(x => x == "Ban").length || 0
                            let puan = await this.client.punishPoint(user.id)
                            msg.edit("" + user.user.tag + " kullanıcısının ceza bilgileri aşağıda belirtilmiştir:\n\nChat Mute: " + chatMute + " kez.\nSes Mute: " + voiceMute + " kez.\nCezalı Bilgisi: "+ jail + " kez.\nBan Bilgisi: " + ban + " kez.\n\nKullanıcı toplamda " + datax.length + " kez kural ihlali yapmış, kullanıcının ceza puanı "+puan+".", {code: "js"})

                        }
                    })
            })
        })
    }
}

module.exports = Cezalar;
