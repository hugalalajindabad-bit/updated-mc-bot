const { executeDashboardCommand } = require('../../commands/dashboard/handler');
const messages = [];
const MAX_MESSAGES = 300;
function addMessage(text, source = 'server') {
  messages.push({ id: `${Date.now()}-${Math.random()}`, text: String(text), source, time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) });
  if (messages.length > MAX_MESSAGES) messages.shift();
}
function home(req, res) { res.render('pages/chat', { title: 'Minecraft Bot Dashboard' }); }
function messagesApi(req, res) { res.json(messages); }
async function send(req, res) {
  const manager = req.app.locals.manager;
  const message = req.body?.message;
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Message cannot be empty.' });
  const value = message.trim();
  if (value.length > 256) return res.status(400).json({ error: 'Message is too long (max 256 characters).' });
  if (value.startsWith('!')) {
    const result = await executeDashboardCommand(manager, value);
    addMessage(`> ${value} — ${result.message}`, 'dashboard');
    return res.status(result.success ? 200 : 400).json(result);
  }
  const result = manager.sendChat(value);
  if (!result.success) return res.status(503).json({ error: result.message });
  addMessage(value, 'dashboard');
  res.json(result);
}
function status(req, res) {
  const manager = req.app.locals.manager;
  const bot = manager.getBot();
  const connected = Boolean(bot?.player && bot?.entity);
  const players = Object.keys(bot?.players || {});
  res.json({
    online: connected, connecting: manager.getState().connecting,
    username: bot?.username || process.env.MC_USERNAME || 'Unknown',
    version: bot?.version || 'Unknown', ping: bot?._client?.latency ?? null,
    health: bot?.health ?? null, food: bot?.food ?? null,
    playersOnline: players.length, players,
    position: bot?.entity?.position ? { x: Math.round(bot.entity.position.x), y: Math.round(bot.entity.position.y), z: Math.round(bot.entity.position.z) } : null,
    dimension: bot?.game?.dimension || 'Unknown'
  });
}
module.exports = { home, messages: messagesApi, send, status, addMessage };
