const { EmbedBuilder } = require('discord.js');

let noEmbeds = new EmbedBuilder()
  .setColor('Random')
  .setTitle(`❌ No embeds were found in your message! React or create thread(s) to start a conversation instead like the one below`)
  .setImage('https://cdn.discordapp.com/attachments/1055441982115295245/1056132727549739038/Screenshot_20221224_022347.png')
  .setFooter({
    text: 'Embeds are links that show a preview of their content when sent in a channel'
  });

let noAttachments = new EmbedBuilder()
  .setColor('Random')
  .setTitle(`❌ No attachments were found in your message! React or create thread(s) to start a conversation instead like the one below`)
  .setImage('https://cdn.discordapp.com/attachments/1055441982115295245/1056132727159652372/Screenshot_20221224_022257.png');

module.exports = {
  noEmbeds: noEmbeds,
  noAttachments: noAttachments
}
