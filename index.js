const { createBotManager } = require('./bot/connection');
const startDashboard = require('./dashboard/server');
const updateServerStatus = require('./webhook');

const manager = createBotManager();
startDashboard(manager);

manager.on('spawn', async (bot) => {
  console.log(`[BOT] Spawned as ${bot.username} (${bot.version || 'unknown version'})`);
  if (updateServerStatus) {
    updateServerStatus(getServerData(bot)).catch(() => {});
  }
});
manager.on('end', () => {
  if (updateServerStatus) updateServerStatus({ online: false }).catch(() => {});
});

let statusTimer;
manager.on('spawn', (bot) => {
  clearInterval(statusTimer);
  statusTimer = setInterval(() => {
    if (bot.player) updateServerStatus(getServerData(bot)).catch(() => {});
  }, 30000);
});
manager.on('end', () => clearInterval(statusTimer));

function getServerData(bot) {
  const players = Object.keys(bot.players || {});
  const time = bot.time?.isDay ? 'day' : 'night';
  const weather = bot.thunderState > 0.5 ? 'thunder' : bot.isRaining ? 'rain' : 'clear';
  return {
    online: Boolean(bot.player), playerCount: players.length, maxPlayers: 50,
    ping: bot.player?.ping ?? -1, players,
    environment: { time, weather }
  };
}

manager.start();
