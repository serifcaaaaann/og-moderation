const Command = require("../base/Command.js")
class Kanal extends Command {
    constructor(client) {
        super(client, {
            name: "kanal",
            aliases: ["kanal"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.hasPermission(8)) return
        if (args[0] == "kilit") {
            message.channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false
            }).then(async() => {
                await this.client.yolla("Kanal başarıyla kilitlendi.", message.author, message.channel)
            })
        }

        if (args[0] == "kilit aç") {
            message.channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
            }).then(async() => {
                await this.client.yolla("Kanalın kilidi başarıyla açıldı.", message.author, message.channel)
            })
        }
    }
}

module.exports = Kanal;
