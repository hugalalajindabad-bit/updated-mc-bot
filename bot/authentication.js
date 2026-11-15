function autoAuthenticate(bot) {
  const password = process.env.MC_PASSWORD;
  if (!password) { console.warn('[AUTH] Password prompt detected but MC_PASSWORD is not configured.'); return false; }
  const template = process.env.MC_PASSWORD_COMMAND || '/password {password}';
  const command = template.replaceAll('{password}', password);
  const delay = Number(process.env.MC_AUTH_DELAY_MS) || 1200;
  setTimeout(() => {
    if (bot.player) { console.log('[AUTH] Sending configured password command.'); bot.chat(command); }
  }, delay);
  return true;
}
module.exports = { autoAuthenticate };
