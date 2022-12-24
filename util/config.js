const { ActivityType } = require('discord.js'),
onboot = require('./onboot'),
{ noEmbeds, noAttachments } = require('./message'),
url = (link) => new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/).test(link);

module.exports = {
  dev: process.env.dev || '858551569263755284',
  auth: process.env.token,
  tick: '✅',
  url: url,
  cross: '❌',
  onboot: onboot,
  noEmbeds: noEmbeds,
  noAttachments: noAttachments,
  activity: {
    afk: false,
    status: 'idle',
    activities: [{
      name: 'The Gallery',
      type: ActivityType.Watching
    }]
  }
}
