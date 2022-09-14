const { SlashCommandBuilder } = require('@discordjs/builders'),
{ ChannelType } = require('discord.js');

module.exports = new SlashCommandBuilder()
.setName('mediaonly')
.setDescription('media (attachment) only channel filter')
.addSubcommand(channel => channel
  .setName('channel')
  .setDescription('add or remove this filter from channels')
  .addChannelOption(add => add
    .setName('add')
    .setDescription('select the channel you want to apply this filter on')
    .addChannelTypes(ChannelType.GuildText))
  .addChannelOption(remove => remove
    .setName('remove')
    .setDescription('select the channel you want to remove this filter from')
    .addChannelTypes(ChannelType.GuildText)))
.addSubcommand(embed => embed
  .setName('embed')
  .setDescription('customize the message sent on deletion')
  .addStringOption(name => name
    .setName('author_name')
    .setDescription('name of the message author'))
  .addAttachmentOption(avatar => avatar
    .setName('author_avatar')
    .setDescription(`upload the author's avatar`))
  .addStringOption(title => title
    .setName('title')
    .setDescription('title of your message appears below author'))
  .addAttachmentOption(thumb => thumb
    .setName('thumbnail')
    .setDescription('small image to the top right corner'))
  .addStringOption(desc => desc
    .setName('description')
    .setDescription('appears below the title'))
  .addAttachmentOption(image => image
    .setName('image')
    .setDescription('large image at the bottom'))
  .addStringOption(text => text
    .setName('footer_text')
    .setDescription('text at the very bottom in small font size'))
  .addAttachmentOption(icon => icon
    .setName('footer_icon')
    .setDescription('small icon that appears before the footer text')))
