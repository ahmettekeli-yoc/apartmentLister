require('dotenv').config();
const axios = require('axios').default;
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => ctx.reply('OK, I am starting to look for apartments.'));
bot.command('stop', Telegraf.reply('Stopping to look for apartments.'));
bot.command('list', Telegraf.reply('Here are the apartments I have found:'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

function messageToGroup(message) {
    const encodedMessage = encodeURI(message);
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_GROUP_CHAT_ID}&text=${encodedMessage}`;
    //send a post request to the url above.
    axios
        .post(url)
        .then((data) => {
            console.log('success');
        })
        .catch((error) => {
            console.log('error');
        });
}

// function messagePrivately(message) {
//     const encodedMessage = encodeURI(message);
//     const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_PRIVATE_CHAT_ID}&text=${encodedMessage}`;
//     axios
//         .post(url)
//         .then((data) => {
//             console.log('success');
//         })
//         .catch((error) => {
//             console.log('error:', error);
//         });
// }


function messagePrivately(message) {
    bot.telegram.sendMessage(process.env.TELEGRAM_PRIVATE_CHAT_ID, message);
}

module.exports = {messagePrivately};
