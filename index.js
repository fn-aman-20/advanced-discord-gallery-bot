const host = require('express')();
host.get('/', (req, res) => res.send('Status: online'));
host.listen(2022);

const {
  Client,
  GatewayIntentBits
} = require('discord.js'),
config = require('./util/config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  presence: config.activity
});

client.config = config;
client.db = require('croxydb');
client.db.setReadable(true);

require('fs').readdirSync('./events').filter(f => f.endsWith('.js')).forEach(e => {
  const event = e.split('.')[0],
    task = require(`./events/${e}`);
  client.on(`${event}`, task.bind(null, client));
});

config.onboot(client, config.auth);
