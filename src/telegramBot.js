require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.command('start', (ctx) => ctx.reply('OK, I am starting to look for apartments.'));
// bot.command('stop', Telegraf.reply('Stopping to look for apartments.'));
// bot.command('list', Telegraf.reply('Here are the apartments I have found:'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

function messagePrivately(message) {
    try {
        bot.telegram.sendMessage(process.env.TELEGRAM_PRIVATE_CHAT_ID, message);
    } catch (error) {
        console.log('telegram error:', error);
        bot.telegram.sendMessage(process.env.TELEGRAM_PRIVATE_CHAT_ID, "Error: " + error);
    }
}

module.exports = { messagePrivately };
