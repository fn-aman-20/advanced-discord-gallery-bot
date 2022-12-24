const { EmbedBuilder } = require('discord.js'),
countdown = new Set();

module.exports = async (client, message) => {
  if (!message.guild || message.author.id === client.user.id) return;
  let data = client.db.get(message.guild.id);
  if (data?.embedonly?.[message.channel.id]) {
    if (message.author.bot && data.message.bot || countdown.has(`e_${message.channel.id}`) && !client.config.url(message.content) || message.content.includes('discord.com/invite')) return await message.delete();
    let args = message.content.split(/ +/g);
    if (args.some(a => a.includes('discord.gg'))) {
      for (const a of args) {
        if (a.includes('discord.gg')) {
          let l = a.split('/');
          if (l[l.length - 1].length <= 10) return await message.delete();
        }
      }
    }
    if (client.config.url(args)) return await message.startThread({
      name: `${message.member.nickname ? message.member.nickname : message.member.user.username}'s Post`
    });
    let embed = data.embedonly.embed;
    (() => {
      let keys = Object.keys(embed);
      if (keys.length === 0) return embed = client.config.noEmbeds;
      if (keys.includes('author') || keys.includes('footer')) {
        if (keys.includes('author')) {
          let info = embed.author;
          if (Object.values(info).every(e => !e)) delete embed.author;
        }
        if (keys.includes('footer')) {
          let info = embed.footer;
          if (Object.values(info).every(e => !e)) delete embed.footer;
        }
      }
      else {
        let values = Object.values(embed);
        if (values.every(e => !e)) return embed = client.config.noEmbeds;
      }
    })();
    countdown.add(`e_${message.channel.id}`);
    await message.delete();
    message.channel.send({
      embeds: [embed]
    })
    .then(msg => setTimeout(() => {
      msg.delete();
      countdown.delete(`e_${message.channel.id}`);
    }, 15_000))
    .catch(() => null);
  }
  else if (data?.mediaonly[message.channel.id]) {
    if (message.author.bot && data.message.bot || countdown.has(`m_${message.channel.id}`) && !message.attachments.size > 0) return await message.delete();
    if (message.attachments.size > 0) return await message.startThread({
      name: `${message.member.nickname ? message.member.nickname : message.member.user.username}'s Post`
    });
    let embed = data.mediaonly.embed;
    (() => {
      let keys = Object.keys(embed);
      if (keys.length === 0) return embed = client.config.noAttachments;
      if (keys.includes('author') || keys.includes('footer')) {
        if (keys.includes('author')) {
          let info = embed.author;
          if (Object.values(info).every(e => !e)) delete embed.author;
        }
        if (keys.includes('footer')) {
          let info = embed.footer;
          if (Object.values(info).every(e => !e)) delete embed.footer;
        }
      }
      else {
        let values = Object.values(embed);
        if (values.every(e => !e)) return embed = client.config.noAttachments;
      }
    })();
    countdown.add(`m_${message.channel.id}`);
    await message.delete();
    message.channel.send({
      embeds: [embed]
    })
    .then(msg => setTimeout(() => {
      msg.delete();
      countdown.delete(`m_${message.channel.id}`);
    }, 15_000))
    .catch(() => null);
  }
}
