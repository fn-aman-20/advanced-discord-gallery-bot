const { EmbedBuilder } = require('discord.js');

let noEmbeds = new EmbedBuilder()
  .setColor('Random')
  .setTitle(`<:cross_mark:988096131714121749> No embeds were found in your message! React or create thread(s) to start a conversation instead like the one below`)
  .setImage('https://cdn.discordapp.com/attachments/926364390062686238/1010073179051532308/Embedonly_2.jpg')
  .setFooter({
    text: 'Embeds are links that show a preview of their content when sent in a channel'
  });

let noAttachments = new EmbedBuilder()
  .setColor('Random')
  .setTitle(`<:cross_mark:988096131714121749> No attachments were found in your message! React or create thread(s) to start a conversation instead like the one below`)
  .setImage('https://cdn.discordapp.com/attachments/926364390062686238/1010073178753749062/Mediaonly_1.jpg');

module.exports = {
  noEmbeds: noEmbeds,
  noAttachments: noAttachments
}
