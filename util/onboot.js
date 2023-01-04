require('colors').enable();
const process = require('process'),
{ EventEmitter } = require('events');

const check = new EventEmitter(),
time = () => {
  const a = new Date(),
  b = new Date(a.getTime() + (330 /* replace this with your timezone offset in minutes e.g. GMT+5:30 => 330 */ + a.getTimezoneOffset()) * 60 * 1000),
  hours = (b.getHours() >= 10) ? `${b.getHours()}` : `0${b.getHours()}`,
  minutes = (b.getMinutes() >= 10) ? `${b.getMinutes()}` : `0${b.getMinutes()}`,
  seconds = (b.getSeconds() >= 10) ? `${b.getSeconds()}` : `0${b.getSeconds()}`;
  return `${hours}:${minutes}:${seconds}`;
},
kill = () => process.kill(1) || process.kill(process.pid);
/*
Note: the 'kill()' thing is only recommended if your vps reboots or falls into ratelimits or ip ban only, else if your vps is reliable, remove these unused items, just keep the console logs
*/

module.exports = function onboot(client, token) {
  client.once('shardReady', (id, na) => {
    console.log(`[${time()}] :: connected :: [shard#${id}]`.rainbow);
    if (na) console.log('  unavailable Guild', na);
  });
  client.on('shardDisconnect', (event, id) => {
    if (!client.isReady()) kill();
    else console.log(`[${time()}] :: disconnected :: [shard#${id}]`.yellow);
  });
  client.on('shardResume', (id, no) => {
    if (!client.isReady()) kill();
    else console.log(`[${time()}] :: reconnected ${no > 1 ? 'after' : 'in'} ${no} attempt${no > 1 ? 's' : ''} :: [shard#${id}]`.blue);
  });
  client.on('shardError', (error, id) => {
    if (!client.isReady()) kill();
    else console.log(`[${time()}] :: error connecting :: [shard#${id}]\n`.red, error);
  });
  client.on('warn', warning => {
    if (!client.isReady()) kill();
    else console.log(`[${time()}] :: warning :: [client]\n`.yellow, warning);
  });
  client.on('error', error => {
    if (!client.isReady()) kill();
    else console.log(`[${time()}] :: error :: [client]\n`.red, error);
  });
  
  client.login(token);
  check.on('login', () => {
    setTimeout(() => client.isReady() ? check.emit('login') : kill(), 15_000);
  });
  check.emit('login');
  
  process.on('unhandledRejection', (reason, p) => {
    console.log(`\n[${time()}] :: Unhandled Rejection`.red);
    console.log(reason, p, `\n`);
  });
  process.on('uncaughtException', (err, origin) => {
    console.log(`\n[${time()}] :: Uncaught Exception/Catch`.red);
    console.log(err, origin, `\n`);
  });
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(`\n[${time()}] :: Uncaught Exception (MONITOR)`.red);
    console.log(err, origin, `\n`);
  });
}
