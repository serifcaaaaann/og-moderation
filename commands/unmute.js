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
class Unmute extends Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            aliases: ["unmute"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(ayarlar.mutehammer) && !message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        let yes = (message.guild.emojis.cache.find(x => x.name == "og_yes"))
        let no = (message.guild.emojis.cache.find(x => x.name == "og_no"))
        if(message.author.id == user.id) return
        if (!user) return message.react(no)
        if (user.voice.serverMute == true) {
            user.voice.setMute(false)
            message.react(yes)
        } else {
        }
        if (user.roles.cache.has(ayarlar.muted)) {
            user.roles.remove(ayarlar.muted)
            message.react(yes)
        } else {
        }

    }
}

module.exports = Unmute;
