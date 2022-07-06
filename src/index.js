const scrapDeutscheWohnen = require('./scrappers/deutsche-wohnen');
const scrapDegewo = require('./scrappers/degewo');
const scrapHowoge = require('./scrappers/howoge');
const { scheduleJob } = require('./scheduler');
const { messagePrivately } = require('./telegramBot');
const scrapVonovia = require('./scrappers/vonovia');

const everyHour = ' 0 * * * *';
const everyMinute = '10 * * * * *';
const every15Minutes = '*/15 * * * *'
const repeatTime = every15Minutes;

let degewoApartments;
let deutscheWohnenApartments;
let howogeApartments;
let vonoiaApartments;

let lastApartments = [];

let isFirstReport = true;
let message;

async function findApartments() {
    deutscheWohnenApartments = await scrapDeutscheWohnen();
    degewoApartments = await scrapDegewo();
    howogeApartments = await scrapHowoge();
    vonoiaApartments = await scrapVonovia();

    howogeApartments ? null : (howogeApartments = { apartments: [] });
    degewoApartments ? null : (degewoApartments = { apartments: [] });
    vonoiaApartments ? null : (vonoiaApartments = { apartments: [] });
    deutscheWohnenApartments ? null : (deutscheWohnenApartments = { apartments: [] });

    return [...deutscheWohnenApartments.apartments, ...degewoApartments.apartments, ...howogeApartments.apartments, ...vonoiaApartments.apartments];
}


async function searchApartments() {
    const apartmentListings = await findApartments();
    message = `I have found ${apartmentListings.length} apartment(s) \n\n`;
    if (isFirstReport) {
        isFirstReport = false;
        apartmentListings.forEach((apartment) => {
            message += `${apartment.title} \n ${apartment.address} \n ${apartment.price} \n ${apartment.rooms} \n ${apartment.size} \n ${apartment.url} \n\n`;
        });
        lastApartments = [...apartmentListings];
        messagePrivately(message);
        console.log(message);
    } else {
        const newApartments = apartmentListings.filter(
            (apartment) => !lastApartments.some((lastApartment) => lastApartment.url === apartment.url)
        );
        if (newApartments.length > 0) {
            message = `I have found ${newApartments.length} new apartment(s) \n\n`
            newApartments.forEach((apartment) => {
                message += `${apartment.title} \n ${apartment.address} \n ${apartment.price} \n ${apartment.rooms} \n ${apartment.size} \n ${apartment.url} \n\n`;
            });
            lastApartments = [...apartmentListings];
            messagePrivately(message);
            console.log(message);
        } else {
            message += 'No new apartments found';
        }
    }
    console.log('--------------------------------------------------------------');
    console.log('message', message);
}

scheduleJob(async () => {
    await searchApartments();
}, repeatTime);

