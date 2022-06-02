const scrapDeutscheWohnen = require('./scrappers/deutsche-wohnen');
const scrapDegewo = require('./scrappers/degewo');
const scrapHowoge = require('./scrappers/howoge');
const { scheduleJob, shutdownJob } = require('./scheduler');

const everyHour = '0 0 * * * *';
const everyMinute = '0 * * * * *';
const repeatTime = everyMinute;

async function findApartments() {
    const apt1 = await scrapDeutscheWohnen();
    const apt2 = await scrapDegewo();
    const apt3 = await scrapHowoge();
    return [apt1, apt2, apt3];
}

scheduleJob(jobFn, repeatTime);

const jobFn = () => {
    console.log('job function.');
};

// setTimeout(() => {
//     shutdownJob();
// }, 61000);

// (async function () {
//     const apartmentListings = await findApartments();
//     console.log(apartmentListings);
// })();

/** TODO:
 *  - Daireleri bir yere kaydet.
 *  - Telegramdan mesaj gonder.
 *  - Her saat calistir. Ayni daireleri kaydetme
 *  - Yeni daire varsa telegramdan mesaj gonder.
 */
