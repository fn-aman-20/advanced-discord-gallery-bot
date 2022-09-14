const { ActivityType } = require('discord.js'),
onboot = require('./onboot'),
{
  noEmbeds,
  noAttachments
} = require('./message');

module.exports = {
  update: false,
  dev: process.env.dev,
  auth: process.env.token,
  tick: '<:check_mark:988095400290451467>',
  cross: '<:cross_mark:988096131714121749>',
  onboot: onboot,
  noEmbeds: noEmbeds,
  noAttachments: noAttachments,
  activities: [
    {
      activities: [{
        name: 'The Gallery',
        type: ActivityType.Watching
      }], status: 'idle'
    },
    {
      activities: [{
        name: 'spectral.host',
        type: ActivityType.Listening
      }], status: 'idle'
    },
    {
      activities: [{
        name: '/help',
        type: ActivityType.Listening
      }], status: 'online'
    }
  ]
}
