const { SlashCommandBuilder } = require('discord.js');

module.exports = new SlashCommandBuilder()
.setName('message')
.setDescription('configure or view message settings')
.addBooleanOption(bot => bot
  .setName('autodelete')
  .setDescription('auto delete other bot messages?'))
.addRoleOption(role => role
  .setName('role')
  .setDescription('members with this role can bypass filters (for mods)'))
.addUserOption(user => user
  .setName('user')
  .setDescription('this user can bypass filters (for friends)'))
