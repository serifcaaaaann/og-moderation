const Command = require("../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../models/cantUnBan.js")
class BanList extends Command {
    constructor(client) {
        super(client, {
            name: "ban-list",
            aliases: ["banlist"]
        });
    }

    async run(message, args, client) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Bu komutu kullanmak için **Yönetici** iznine sahip olmalısın.")
        message.guild.fetchBans(true).then(banned => {
            let list = banned.map(user => `${user.user.id} | ${user.user.tag}`).join('\n');
            message.channel.send(`${list}\n\nSunucuda toplamda ${banned.size} yasaklı kullanıcı bulunmakta.`, { code: "js", split: true })

        })
    }
}



module.exports = BanList;
