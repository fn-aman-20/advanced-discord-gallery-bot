const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = new SlashCommandBuilder()
.setName('help')
.setDescription('know about me before you command!')
