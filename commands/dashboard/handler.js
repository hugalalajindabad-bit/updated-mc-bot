const fs = require('fs');
const path = require('path');
const commands = new Map();
const dir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(dir).filter(file => file.endsWith('.js'))) {
  const command = require(path.join(dir, file));
  if (command.name && typeof command.execute === 'function') commands.set(command.name, command);
}
async function executeDashboardCommand(manager, raw) {
  const parts = raw.trim().slice(1).split(/\s+/);
  const name = (parts.shift() || '').toLowerCase();
  const command = commands.get(name);
  if (!command) return { success: false, message: `Unknown dashboard command: !${name}` };
  try { return await command.execute({ manager, args: parts, raw }); }
  catch (error) { console.error(`[DASHBOARD COMMAND] ${name}`, error); return { success: false, message: error.message || 'Command failed.' }; }
}
module.exports = { executeDashboardCommand, commands };
