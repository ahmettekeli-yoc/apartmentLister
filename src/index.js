const scrapDeutscheWohnen = require('./scrappers/deutsche-wohnen');
const scrapDegewo = require('./scrappers/degewo');
const scrapHowoge = require('./scrappers/howoge');
const { scheduleJob } = require('./scheduler');
const { messagePrivately } = require('./telegramBot');
const scrapVonovia = require('./scrappers/vonovia');

const everyHour = ' 56 * * * *';
const everyMinute = '10 * * * * *';
const every15Minutes = '*/15 * * * *';
const repeatTime = everyHour;

let degewoApartments;
let deutscheWohnenApartments;
let howogeApartments;
let vonoiaApartments;

let lastApartments = [];

let isFirstReport = true;
let message;
let log;

async function findApartments() {
    deutscheWohnenApartments = await scrapDeutscheWohnen();
    degewoApartments = await scrapDegewo();
    howogeApartments = await scrapHowoge();
    vonoiaApartments = await scrapVonovia();

    howogeApartments ? null : (howogeApartments = { apartments: [] });
    degewoApartments ? null : (degewoApartments = { apartments: [] });
    vonoiaApartments ? null : (vonoiaApartments = { apartments: [] });
    deutscheWohnenApartments ? null : (deutscheWohnenApartments = { apartments: [] });

    return [
        ...deutscheWohnenApartments.apartments,
        ...degewoApartments.apartments,
        ...howogeApartments.apartments,
        ...vonoiaApartments.apartments,
    ];
}

async function searchApartments() {
    const apartmentListings = await findApartments();
    message = `I have found ${apartmentListings.length} apartment(s) \n\n`;
    log = `I have found ${apartmentListings.length} apartment(s)\n`;
    if (isFirstReport) {
        isFirstReport = false;
        apartmentListings.forEach((apartment, index) => {
            if (index !== 0 && index % 5 === 0) {
                messagePrivately(message);
                message = '';
            }
            message += `${apartment.title} \n ${apartment.address} \n ${apartment.price} \n ${apartment.rooms} \n ${apartment.size} \n ${apartment.url} \n\n`;
        });
        lastApartments = [...apartmentListings];
        messagePrivately(message);
    } else {
        const newApartments = apartmentListings.filter(
            (apartment) => !lastApartments.some((lastApartment) => lastApartment.url === apartment.url)
        );
        if (newApartments.length > 0) {
            message = `I have found ${newApartments.length} new apartment(s) \n\n`;
            log = `I have found ${newApartments.length} new apartment(s)\n`;
            newApartments.forEach((apartment, index) => {
                if (index !== 0 && index % 5 === 0) {
                    messagePrivately(message);
                    message = '';
                }
                message += `${apartment.title} \n ${apartment.address} \n ${apartment.price} \n ${apartment.rooms} \n ${apartment.size} \n ${apartment.url} \n\n`;
            });
            lastApartments = [...apartmentListings];
            messagePrivately(message);
        } else {
            message += 'No new apartments found';
            log += 'No new apartments found';
        }
    }
    console.log(log);
}

scheduleJob(async () => {
    await searchApartments();
}, repeatTime);
