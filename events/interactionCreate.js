const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder
} = require('discord.js');

module.exports = async (client, i) => {
  if (!i.guild || i.user.bot) return;
  if (!i.memberPermissions.toArray().includes('Administrator') && i.user.id !== main.dev) return await i.reply({
    content: 'Sorry, I agree with Admins for my configuration',
    ephemeral: true
  });
  if (i.isCommand()) {
    let data = client.db.get(i.guild.id);
    if (!data) data = {
      embedonly: {
        embed: {}
      },
      mediaonly: {
        embed: {}
      },
      message: {
        bot: false,
        roles: [],
        users: []
      }
    };
    await i.deferReply({ ephemeral: true });
    if (i.commandName === 'embedonly') {
      if (i.options._subcommand === 'channel') {
        const add = i.options.getChannel('add'),
        remove = i.options.getChannel('remove');
        if (add.id in data.embedonly) return i.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle(`This filter is enabled in ${add.name} beforehand.`)
            .setColor('Random')
          ]
        }).then(() => setTimeout(() => i.deleteReply(), 5_000));
        if (add.id in data.mediaonly) return i.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle(`That is a mediaonly channel!`)
            .setColor('Random')
          ]
        }).then(() => setTimeout(() => i.deleteReply(), 5_000));
        const embeds = [];
        data.embedonly[add.id] = {};
        embeds.push(
          new EmbedBuilder()
          .setTitle(`${client.config.tick} Applied the embedonly filter to ${add.name}`)
          .setColor('Random')
        );
        if (remove?.id in data.embedonly) {
          delete data.embedonly[remove.id];
          embeds.push(
            new EmbedBuilder()
            .setTitle(`${client.config.tick} Remove the embedonly filter from ${remove.name}`)
            .setColor('Random')
          );
        }
        client.db.set(i.guild.id, data);
        i.editReply({
          embeds: embeds
        });
      }
      else if (i.options._subcommand === 'embed') {
        const embed = data.embedonly.embed,
        message = {
          author: {
            name: i.options.getString('author_name') || null,
            iconURL: (i.options.getAttachment('author_avatar'))?.url || null
          },
          title: i.options.getString('title') || null,
          thumbnail: (i.options.getAttachment('thumbnail'))?.url || null,
          description: i.options.getString('description') || null,
          image: (i.options.getAttachment('image'))?.url || null,
          footer: {
            text: i.options.getString('footer_text') || null,
            iconURL: (i.options.getAttachment('footer_icon'))?.url || null
          }
        };
        Object.assign(embed, message);
        data.embedonly.embed = embed;
        client.db.set(i.guild.id, data);
        return i.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle(`${client.config.tick} Changes Saved`)
            .setColor('Random')
          ]
        }).then(() => setTimeout(() => i.deleteReply(), 5_000));
      }
    }
    else if (i.commandName === 'mediaonly') {
      if (i.options._subcommand === 'channel') {
        const add = i.options.getChannel('add'),
        remove = i.options.getChannel('remove');
        if (add.id in data.mediaonly) return i.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle(`This filter is enabled in ${add.name} beforehand.`)
            .setColor('Random')
          ]
        }).then(() => setTimeout(() => i.deleteReply(), 5_000));
        if (add.id in data.embedonly) return i.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle(`That is a mediaonly channel!`)
            .setColor('Random')
          ]
        }).then(() => setTimeout(() => i.deleteReply(), 5_000));
        const embeds = [];
        data.mediaonly[add.id] = {};
        embeds.push(
          new EmbedBuilder()
          .setTitle(`${client.config.tick} Applied the embedonly filter to ${add.name}`)
          .setColor('Random')
        );
        if (remove?.id in data.mediaonly) {
          delete data.mediaonly[remove.id];
          embeds.push(
            new EmbedBuilder()
            .setTitle(`${client.config.tick} Remove the embedonly filter from ${remove.name}`)
            .setColor('Random')
          );
        }
        client.db.set(i.guild.id, data);
        i.editReply({
          embeds: embeds
        });
      }
      else if (i.options._subcommand === 'embed') {
        const embed = data.mediaonly.embed,
        message = {
          author: {
            name: i.options.getString('author_name') || null,
            iconURL: (i.options.getAttachment('author_avatar'))?.url || null
          },
          title: i.options.getString('title') || null,
          thumbnail: (i.options.getAttachment('thumbnail'))?.url || null,
          description: i.options.getString('description') || null,
          image: (i.options.getAttachment('image'))?.url || null,
          footer: {
            text: i.options.getString('footer_text') || null,
            iconURL: (i.options.getAttachment('footer_icon'))?.url || null
          }
        };
        Object.assign(embed, message);
        data.mediaonly.embed = embed;
        client.db.set(i.guild.id, data);
        return i.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle(`${client.config.tick} Changes Saved`)
            .setColor('Random')
          ]
        }).then(() => setTimeout(() => i.deleteReply(), 5_000));
      }
    }
    else if (i.commandName === 'help') {
      await i.editReply({
        embeds: [new EmbedBuilder()
        .setColor('Random')
        .setTitle('Heard you calling me!')
        .setThumbnail(i.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Let's get started in case you don't know any of my commands:`)
        .addFields(
          {
            name: '/mediaonly',
            value: `Has two sub commands ~ \`channel\` and \`embed\`\n**channel** ➜ add or remove this filter from channels\n**embed** ➜ customize the message sent on deletion!`
          },
          {
            name: '/embedonly',
            value: `Also has two sub commands ~ \`channel\` and \`embed\`\n**channel** ➜ add or remove channels from this filter\n**embed** ➜ customize the message sent on deletion!`
          },
          {
            name: '/message',
            value: `Has three sub commands ~ \`bot\`, \`role\`, and \`user\`\n**bot** ➜ enable or disable auto deletion of other bot messages\n**role** ➜ I'll ignore and allow people with this role to text on filtered channels (recommended for mods)\n**user** ➜ I'll allow a specific user to bypass all my filters`
          }
        )
        .setFooter({
          text: `${client.user.username} on ${i.guild.name}!`,
          iconURL: client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()]
      });
    }
    else if (i.commandName === 'message') {
      let bot = i.options.getBoolean('autodelete'),
      role = i.options.getRole('role'), roles = '',
      user = i.options.getUser('user'), users = '';
      if (bot) data.message.bot = true;
      else data.message.bot = false;
      if (!data.message.roles.includes(role?.id) && role) data.message.roles.push(role.id);
      if (!data.message.users.includes(user?.id) && user) data.message.users.push(user.id);
      client.db.set(i.guild.id, data);
      let embed = new EmbedBuilder();
      embed.setColor('Random');
      embed.setTitle(`${main.tick} Message Settings`);
      embed.setThumbnail(i.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }));
      embed.addFields({ name: 'auto delete bot text', value: `\`\`\`js\n${data.message.bot}\`\`\``, inline: true });
      if (data.message.roles.length !== 0) {
        for (const r of data.message.roles) roles += `> <@&${r}>\n`;
        embed.addFields({ name: 'roles allowed', value: roles, inline: true });
      }
      if (data.message.users.length !== 0) {
        for (const u of data.message.users) users += `> <@${u}>\n`;
        embed.addFields({ name: 'users allowed', value: users, inline: true })
      }
      embed.setFooter({
        text: `${client.user.username} on ${i.guild.name}!`,
        iconURL: client.user.displayAvatarURL({ dynamic: true })
      });
      i.editReply({
        embeds: [embed]
      });
    }
    else return i.editReply({
      embeds: [new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${main.cross} No response, please report this asap on our support server!`)],
      components: [new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel('Support Server')
        .setStyle('Link')
        .setURL('https://discord.gg/NmcKr9S8tp')
      )]
    });
  }
}
