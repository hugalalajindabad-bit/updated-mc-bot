const axios = require('axios');
async function updateServerStatus(data = {}) {
  const webhookURL = process.env.DISCORD_WEBHOOK_URL;
  const messageID = process.env.DISCORD_MESSAGE_ID;
  if (!webhookURL || !messageID) return false;
  const online = Boolean(data.online);
  const players = Array.isArray(data.players) ? data.players : [];
  const environment = data.environment || {};
  const timestamp = Math.floor(Date.now() / 1000);
  const weatherEmoji = { clear: '☀️', rain: '🌧️', thunder: '⛈️' };
  const embed = {
    title: '⛏️ Majdur Union | Server Status', color: online ? 0x00ff00 : 0xff0000,
    fields: [
      { name: '📡 Server Status', value: online ? '🟢 Online' : '🔴 Offline', inline: true },
      { name: '👥 Players', value: online ? `\`${data.playerCount ?? players.length}/50\`` : '`N/A`', inline: true },
      { name: '🏓 Ping', value: online ? `\`${data.ping ?? 0}ms\`` : '`N/A`', inline: true },
      { name: '🎮 Player List', value: players.length ? players.map(name => `\`${name}\``).join(', ').slice(0, 1024) : '`No players online`' },
      { name: '🌍 Environment', value: online ? `Time: ${environment.time || 'Unknown'} · Weather: ${weatherEmoji[environment.weather] || '❔'}` : 'Unknown' },
      { name: '🕒 Last Updated', value: `<t:${timestamp}:R>` }
    ], footer: { text: 'Majdur Union • Live Server Monitor' }
  };
  try { await axios.patch(`${webhookURL.replace(/\/$/, '')}/messages/${messageID}`, { embeds: [embed] }, { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }); return true; }
  catch (error) { console.error('[DISCORD WEBHOOK]', error.response?.data || error.message); return false; }
}
module.exports = updateServerStatus;
