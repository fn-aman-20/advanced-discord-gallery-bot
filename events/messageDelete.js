module.exports = async (client, message) => {
  if (!message.hasThread || message.author.bot) return;
  const data = client.db.get(message.guild.id),
  list = Object.keys(data.embedonly).concat(Object.values(data.mediaonly));
  if (list.includes(message.channel.id)) return await message.thread.delete();
}
