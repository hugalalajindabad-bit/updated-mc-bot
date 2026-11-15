module.exports = {
  name: 'tpaccept', description: 'Accepts an incoming teleport request', allowList: true,
  execute(bot) { bot.chat(process.env.TPACCEPT_COMMAND || '/tpaccept'); }
};
