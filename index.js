const host = require('express')();
host.get('/', (req, res) => res.send('Status: online'));
host.listen(2022);

const {
  EmbedBuilder,
  ButtonBuilder,
  Client, Routes,
  ActionRowBuilder,
  GatewayIntentBits,
  PermissionsBitField
} = require('discord.js'),
{ REST } = require('@discordjs/rest'),
db = require('croxydb'),
main = require('./util/config');
db.setReadable(true);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
}),
rest = new REST({ version: '10' }).setToken(main.auth),
url = (link) => new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/).test(link);

let commands = [], countdown = new Set(), database = db.all(),
commandFiles = require('fs').readdirSync('./commands').filter(f => f.endsWith('.js'));
for (let command of commandFiles) {
  command = command.split('.')[0];
  let json = require(`./commands/${command}`).toJSON();
  commands.push(json);
};

client.on('ready', async () => {
  if (main.update) {
    const guilds = Array.from((await client.guilds.fetch()).values());
    for (const guild of guilds) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, guild.id),
          { body: commands }
        );
      } catch {
        console.log(`Failed to load (/) Slash Commands for ${guild.name} (${guild.id})`);
      }
    }
  }
  setInterval(() => {
    client.user.setPresence(main.activities[Math.floor(Math.random() * main.activities.length)]);
  }, 15 * 1000);
});

client.on('messageCreate', async message => {
  if (!message.inGuild() || message.author.id === client.user.id) return;
  let data = database[message.guild.id] || db.get(message.guild.id);
  if (data?.embedonly[message.channel.id]) {
    if (message.author.bot && data.message.bot || countdown.has(`e_${message.channel.id}`) && !url(message.content) || message.content.includes('discord.com/invite')) return await message.delete();
    let args = message.content.split(/ +/g);
    if (args.some(a => a.includes('discord.gg'))) {
      for (const a of args) {
        if (a.includes('discord.gg')) {
          let l = a.split('/');
          if (l[l.length - 1].length <= 10) return await message.delete();
        }
      }
    }
    if (url(args)) return await message.startThread({
      name: `${message.member.nickname ? message.member.nickname : message.member.user.username}'s Post`
    });
    if (data.embedonly.embed) {
      let embed = new EmbedBuilder();
      embed.setColor('Random');
      if (data.embedonly.embed.author?.name && data.embedonly.embed.author?.iconURL) embed.setAuthor({
        name: data.embedonly.embed.author.name,
        iconURL: data.embedonly.embed.author.iconURL
      })
      else if (data.embedonly.embed.author?.name && !data.embedonly.embed.author?.iconURL) embed.setAuthor({ name: data.embedonly.embed.author.name })
      else if (!data.embedonly.embed.author?.name && data.embedonly.embed.author?.iconURL) embed.setAuthor({ name: client.user.username, iconURL: data.embedonly.embed.author.iconURL });
      if (data.embedonly.embed.title) embed.setTitle(data.embedonly.embed.title);
      if (data.embedonly.embed.thumbnail) embed.setThumbnail(data.embedonly.embed.thumbnail);
      if (data.embedonly.embed.description) embed.setDescription(data.embedonly.embed.description);
      if (data.embedonly.embed.image) embed.setImage(data.embedonly.embed.image);
      if (data.embedonly.embed.footer?.text && data.embedonly.embed.footer?.iconURL) embed.setFooter({
        text: data.embedonly.embed.footer.text,
        iconURL: data.embedonly.embed.footer.iconURL
      })
      else if (data.embedonly.embed.footer?.text && !data.embedonly.embed.footer?.iconURL) embed.setFooter({ text: data.embedonly.embed.footer.text })
      else if (!data.embedonly.embed.footer?.text && data.embedonly.embed.footer?.iconURL) embed.setFooter({ text: `${client.user.username} on ${message.guild.name}!`, iconURL: data.embedonly.embed.author.iconURL });
      try {
        countdown.add(`e_${message.channel.id}`);
        await message.delete().then(() => {
          message.channel.send({
            embeds: [embed]
          }).then(msg => {
            setTimeout(() => {
              msg.delete();
              countdown.delete(`e_${message.channel.id}`);
            }, 15 * 1000);
          });
        });
      } catch {
        countdown.add(`e_${message.channel.id}`);
        await message.delete().then(() => {
          message.channel.send({
            embeds: [main.noEmbeds]
          }).then(msg => {
            setTimeout(() => {
              msg.delete();
              countdown.delete(`e_${message.channel.id}`);
            }, 15 * 1000);
          });
        });
      }
    } else {
      countdown.add(`e_${message.channel.id}`);
      await message.delete().then(() => {
        message.channel.send({
          embeds: [main.noEmbeds]
        }).then(msg => {
          setTimeout(() => {
            msg.delete();
            countdown.delete(`e_${message.channel.id}`);
          }, 15 * 1000);
        });
      });
    }
  }
  else if (data?.mediaonly[message.channel.id]) {
    if (message.author.bot && data.message.bot || countdown.has(`m_${message.channel.id}`) && !message.attachments.size > 0) return await message.delete();
    if (message.attachments.size > 0) return await message.startThread({
      name: `${message.member.nickname ? message.member.nickname : message.member.user.username}'s Post`
    });
    let data = database[message.guild.id] || db.get(i.guild.id);
    if (data.mediaonly.embed) {
      let embed = new EmbedBuilder();
      embed.setColor('Random');
      if (data.mediaonly.embed.author?.name && data.mediaonly.embed.author?.iconURL) embed.setAuthor({
        name: data.mediaonly.embed.author.name,
        iconURL: data.mediaonly.embed.author.iconURL
      })
      else if (data.mediaonly.embed.author?.name && !data.mediaonly.embed.author?.iconURL) embed.setAuthor({ name: data.mediaonly.embed.author.name })
      else if (!data.mediaonly.embed.author?.name && data.mediaonly.embed.author?.iconURL) embed.setAuthor({ name: client.user.username, iconURL: data.mediaonly.embed.author.iconURL });
      if (data.mediaonly.embed.title) embed.setTitle(data.mediaonly.embed.title);
      if (data.mediaonly.embed.thumbnail) embed.setThumbnail(data.mediaonly.embed.thumbnail);
      if (data.mediaonly.embed.description) embed.setDescription(data.mediaonly.embed.description);
      if (data.mediaonly.embed.image) embed.setImage(data.mediaonly.embed.image);
      if (data.mediaonly.embed.footer?.text && data.mediaonly.embed.footer?.iconURL) embed.setFooter({
        text: data.mediaonly.embed.footer.text,
        iconURL: data.mediaonly.embed.footer.iconURL
      })
      else if (data.mediaonly.embed.footer?.text && !data.mediaonly.embed.footer?.iconURL) embed.setFooter({ text: data.mediaonly.embed.footer.text })
      else if (!data.mediaonly.embed.footer?.text && data.mediaonly.embed.footer?.iconURL) embed.setFooter({ text: `${client.user.username} on ${message.guild.name}!`, iconURL: data.mediaonly.embed.author.iconURL });
      try {
        countdown.add(`m_${message.channel.id}`);
        await message.delete().then(() => {
          message.channel.send({
            embeds: [embed]
          }).then(msg => {
            setTimeout(() => {
              msg.delete();
              countdown.delete(`m_${message.channel.id}`);
            }, 15 * 1000);
          });
        });
      } catch {
        countdown.add(`m_${message.channel.id}`);
        await message.delete().then(() => {
          message.channel.send({
            embeds: [main.noAttachments]
          }).then(msg => {
            setTimeout(() => {
              msg.delete();
              countdown.delete(`m_${message.channel.id}`);
            }, 15 * 1000);
          });
        });
      }
    } else {
      countdown.add(`m_${message.channel.id}`);
      await message.delete().then(() => {
        message.channel.send({
          embeds: [main.noAttachments]
        }).then(msg => {
          setTimeout(() => {
            msg.delete();
            countdown.delete(`m_${message.channel.id}`);
          }, 15 * 1000);
        });
      });
    }
  }
});

client.on('messageDelete', async message => {
  if (message.hasThread) {
    try { await message.thread.delete() }
    catch { return }
  }
});

client.on('interactionCreate', async i => {
  if (i.user.bot || !i.inGuild()) return;
  if (!i.member.permissions.has(PermissionsBitField.Flags.Administrator) && i.user.id !== main.dev) return await i.reply({
    content: 'Sorry, I agree with Admins for my configuration',
    ephemeral: true
  });
  if (i.isCommand()) {
    let data = database[i.guild.id] || db.get(i.guild.id);
    if (!data) {
      data = {
        embedonly: {},
        mediaonly: {},
        message: {
          bot: false,
          roles: [],
          users: []
        }
      };
      db.set(i.guild.id, data);
      database = db.all();
      data = database[i.guild.id] || db.get(i.guild.id);
    };
    await i.deferReply({ ephemeral: true });
    if (i.commandName === 'embedonly') {
      if (i.options._subcommand === 'channel') {
        const add = i.options.getChannel('add'),
        remove = i.options.getChannel('remove');
        if (!add && !remove) {
          try { delete data.embedonly.embed } catch {};
          if (Object.keys(data.embedonly).length === 0) return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.cross} None of your server channels are having this filter at the moment`)]
          });
          let msg = '';
          for (const id of Array.from(Object.keys(data.embedonly))) msg += `> <#${id}>\n`;
          await i.editReply({
            embeds: [new EmbedBuilder()
            .setTitle(`Current EmbedOnly Channels`)
            .setThumbnail(i.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
              {
                name: `${main.tick} click to navigate`,
                value: msg
              }
            )
            .setFooter({
              text: `${client.user.username} on ${i.guild.name}!`,
              iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp()]
          })
        }
        else if (add) {
          if (data.embedonly[add.id]) return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.cross} That channel already has this filter, no changes were made`)]
          });
          if (data.mediaonly[add.id]) return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.cross} That channel is media only`)]
          });
          data.embedonly[add.id] = {};
          db.set(i.guild.id, data);
          database = db.all();
          await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.tick} Applied the filter on ${add.name}!`)]
          });
        }
        else {
          if (data.embedonly[remove.id]) {
            delete data.embedonly[remove.id];
            db.set(i.guild.id, data);
            database = db.all();
            await i.editReply({
              embeds: [new EmbedBuilder()
              .setColor('Random')
              .setTitle(`${main.tick} Removed the filter from ${remove.name}!`)]
            });
          }
          else return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.cross} That channel is not having this filter!`)]
          });
        }
      }
      else if (i.options._subcommand === 'embed') {
        const message = {
          author: {
            name: i.options.getString('author_name'),
            iconURL: (i.options.getAttachment('author_avatar'))?.url || null
          },
          title: i.options.getString('title'),
          thumbnail: (i.options.getAttachment('thumbnail'))?.url || null,
          description: i.options.getString('description'),
          image: (i.options.getAttachment('image'))?.url || null,
          footer: {
            text: i.options.getString('footer_text'),
            iconURL: (i.options.getAttachment('footer_icon'))?.url || null
          }
        };
        let input = Object.values(message.author), change = false;
        input.push(
          message.title,
          message.thumbnail,
          message.description,
          message.image,
          message.footer.text,
          message.footer.iconURL
        );
        let dat = [
          data.embedonly.embed?.author?.name,
          data.embedonly.embed?.author?.iconURL,
          data.embedonly.embed?.title,
          data.embedonly.embed?.thumbnail,
          data.embedonly.embed?.description,
          data.embedonly.embed?.image,
          data.embedonly.embed?.footer?.text,
          data.embedonly.embed?.footer?.iconURL
        ];
        for (const i of input) {
          if (i && i !== dat[input.indexOf(i)]) {
            change = true;
            break;
          }
        }
        if (change) {
          data.embedonly.embed = message;
          db.set(i.guild.id, data);
          database = db.all();
          return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.tick} Updated the message embed!`)]
          });
        } else return await i.editReply({
          embeds: [new EmbedBuilder()
          .setColor('Random')
          .setTitle(`${main.cross} No changes were made`)]
        });
      }
    }
    else if (i.commandName === 'mediaonly') {
      if (i.options._subcommand === 'channel') {
        const add = i.options.getChannel('add'),
        remove = i.options.getChannel('remove');
        if (!add && !remove) {
          try { delete data.mediaonly.embed } catch {};
          if (Object.keys(data.mediaonly).length === 0) return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.cross} None of your server channels are having this filter at the moment`)]
          });
          let msg = '';
          for (const id of Array.from(Object.keys(data.mediaonly))) msg += `> <#${id}>\n`;
          await i.editReply({
            embeds: [new EmbedBuilder()
            .setTitle(`Current MediaOnly Channels`)
            .setThumbnail(i.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
              {
                name: `${main.tick} click to navigate`,
                value: msg
              }
            )
            .setFooter({
              text: `${client.user.username} on ${i.guild.name}!`,
              iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp()]
          })
        }
        else if (add) {
          if (data.mediaonly[add.id]) return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.cross} That channel already has this filter, no changes were made`)]
          });
          if (data.embedonly[add.id]) return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.cross} That channel is embed only`)]
          });
          data.mediaonly[add.id] = {};
          db.set(i.guild.id, data);
          database = db.all();
          await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.tick} Applied the filter on ${add.name}!`)]
          });
        }
        else {
          if (data.mediaonly[remove.id]) {
            delete data.mediaonly[remove.id];
            db.set(i.guild.id, data);
            database = db.all();
            await i.editReply({
              embeds: [new EmbedBuilder()
              .setColor('Random')
              .setTitle(`${main.tick} Removed the filter from ${remove.name}!`)]
            });
          }
          else return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.cross} That channel is not having this filter!`)]
          });
        }
      }
      else if (i.options._subcommand === 'embed') {
        const message = {
          author: {
            name: i.options.getString('author_name'),
            iconURL: (i.options.getAttachment('author_avatar'))?.url || null
          },
          title: i.options.getString('title'),
          thumbnail: (i.options.getAttachment('thumbnail'))?.url || null,
          description: i.options.getString('description'),
          image: (i.options.getAttachment('image'))?.url || null,
          footer: {
            text: i.options.getString('footer_text'),
            iconURL: (i.options.getAttachment('footer_icon'))?.url || null
          }
        };
        let input = Object.values(message.author), change = false;
        input.push(
          message.title,
          message.thumbnail,
          message.description,
          message.image,
          message.footer.text,
          message.footer.iconURL
        );
        let dat = [
          data.mediaonly.embed?.author?.name,
          data.mediaonly.embed?.author?.iconURL,
          data.mediaonly.embed?.title,
          data.mediaonly.embed?.thumbnail,
          data.mediaonly.embed?.description,
          data.mediaonly.embed?.image,
          data.mediaonly.embed?.footer?.text,
          data.mediaonly.embed?.footer?.iconURL
        ];
        for (const i of input) {
          if (i && i !== dat[input.indexOf(i)]) {
            change = true;
            break;
          }
        }
        if (change) {
          data.mediaonly.embed = message;
          db.set(i.guild.id, data);
          database = db.all();
          return await i.editReply({
            embeds: [new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${main.tick} Updated the message embed!`)]
          });
        }
        else return await i.editReply({
          embeds: [new EmbedBuilder()
          .setColor('Random')
          .setTitle(`${main.cross} No changes were made`)]
        });
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
      role = i.options.getRole('role'), roles ='',
      user = i.options.getUser('user'), users ='';
      if (bot) data.message.bot = true;
      if (!data.message.roles.includes(role?.id) && role) data.message.roles.push(role.id);
      if (!data.message.users.includes(user?.id) && user) data.message.users.push(user.id);
      db.set(i.guild.id, data);
      database = db.all();
      data = database[i.guild.id] || db.get(i.guild.id);
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
      await i.editReply({
        embeds: [embed]
      });
    }
    else return await i.editReply({
      embeds: [new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${main.cross} No response, please report this asap on our support server!`)],
      components: [new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel('Support Server')
        .setStyle('Link')
        .setURL('https://discord.gg/kxbcT5WsMd')
      )]
    });
  }
});

client.on('guildCreate', async guild => {
  db.set(guild.id, {
    embedonly: {},
    mediaonly: {},
    message: {
      bot: false,
      roles: [],
      users: []
    }
  });
  database = db.all();
  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guild.id),
      { body: commands }
    );
  } catch {
    console.log(`Failed to load (/) Slash Commands for ${guild.name} (${guild.id})`);
  }
});

client.on('guildDelete', async guild => {
  db.delete(guild.id);
  database = db.all();
});

main.onboot(client, main.auth);
