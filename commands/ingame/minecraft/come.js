module.exports = {
  name: 'come', description: 'Teleports the bot to the requesting player (server permission required)', allowList: true,
  execute(bot, username) {
    const template = process.env.COME_COMMAND || '/tpa {player}';
    bot.chat(template.replaceAll('{player}', username));
  }
};
