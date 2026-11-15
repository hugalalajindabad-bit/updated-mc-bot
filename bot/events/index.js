const { autoAuthenticate } = require('../authentication');
function registerBotEvents(bot, callbacks = {}) {
  let authSent = false;
  bot.on('spawn', () => { authSent = false; callbacks.onSpawn?.(); });
  bot.on('message', message => {
    const text = message?.toString?.() || '';
    if (/waiting for your password|enter your password|password required|please login|please log in|login required/i.test(text) && !authSent) {
      authSent = true;
      autoAuthenticate(bot);
    }
    if (!text.includes('start Keep Alive Request Received')) console.log('[CHAT]', text);
  });
  bot.on('end', reason => callbacks.onEnd?.(reason));
  bot.on('health', () => {});
}
module.exports = { registerBotEvents };
