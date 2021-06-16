const Command = require("../base/Command.js");
const Discord = require("discord.js")
const ayarlar = require ("../ayarlar.json")
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            aliases: []
        });
    }

    async run(message, args, data) {
        if (!message.member.roles.cache.has(ayarlar.genelyetkili) && !message.member.roles.cache.has(ayarlar.kurucu) && !message.member.roles.cache.has(ayarlar.kurucualt) && !message.member.roles.cache.has(ayarlar.ustyonetici) && !message.member.roles.cache.has(ayarlar.yonetici) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let tag = this.client.users.cache.filter(x => x.username.includes(ayarlar.tag)).size
        let ses = message.guild.members.cache.filter(x => x.voice.channel).size
        let members = message.guild.members.cache.size
        let online = message.guild.members.cache.filter(m => m.presence.status !== "offline").size
        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription("`•` Seste toplam **" + ses + "** kullanıcı var.\n`•` Sunucumuzda toplam **" + members + "** üye var.\n`•` Sunucumuzda toplam **" + online + "** çevrimiçi üye var.\n`•` Toplam **" + tag + "** kişi tagımıza sahip.")
        message.channel.send(embed);

    }

};

module.exports = Say;
