const fs = require('fs'), commands = [];

fs.readdirSync('./commands').filter(f => f.endsWith('.js'))
.forEach(command => {
  const file = require(`../commands/${command}`);
  commands.push(file.toJSON());
});

module.exports = async (client) => {
  await client.application.commands.set(commands);
}
