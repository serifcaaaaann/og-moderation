const cezalar = require("../models/cezalı.js")
const mute = require("../models/chatmute.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const ayarlar = require ("../ayarlar.json")
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(member) {
        if (Date.now() - member.user.createdTimestamp < ms("5d")) {
            return member.roles.add()
        }
        let emoji = ""
        if (Date.now() - member.user.createdTimestamp < ms("5d")) {
            emoji = `${this.client.no}`
        } else {
            emoji = `${this.client.ok}`
        }
        member.roles.add([])
        cezalar.findOne({ user: member.id }, async (err, res) => {
            if (!res) {

                setTimeout(() => {
                    member.roles.add([])
                }, 1500);
                this.client.channels.cache.get().send("🎉 Sunucumuza hoş geldin <@!" + member + "> !\n\nHesabın " + moment(member.user.createdTimestamp).format("LLL") + " tarihinde (" + moment(member.user.createdTimestamp).fromNow() + ") oluşturulmuş. " + emoji + "\n\nSunucu kurallarımız <#727881636296785981> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n\nSeninle beraber " + member.guild.members.cache.size + " kişi olduk ! Tagımızı alarak bizlere destek olabilirsin ! Kayıt olmak için teyit odalarına girip ses teyit vermen gerekiyor yetkililerimiz seninle ilgilenecektir ! İyi eğlenceler.")
            } else if (res) {
                if (res.ceza == false) {
                    setTimeout(() => {
                        member.roles.add([])
                    }, 1500)
                    this.client.channels.cache.get().send("🎉 Sunucumuza hoş geldin <@!" + member + "> !\n\nHesabın " + moment(member.user.createdTimestamp).format("LLL") + " tarihinde (" + moment(member.user.createdTimestamp).fromNow() + ") oluşturulmuş. " + emoji + "\n\nSunucu kurallarımız <#727881636296785981> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n\nSeninle beraber " + member.guild.members.cache.size + " kişi olduk ! Tagımızı alarak bizlere destek olabilirsin ! Kayıt olmak için teyit odalarına girip ses teyit vermen gerekiyor yetkililerimiz seninle ilgilenecektir ! İyi eğlenceler.")
                } else if (res.ceza == true) {
                    member.roles.remove([])
                    member.roles.add(ayarlar.jail)
                }
            }
        })
        mute.findOne({ user: member.id }, async (err, res) => {
            if (!res) return
            if (res.muted == true) {
                member.roles.add(ayarlar.muted)
            }
        })
    }
};
