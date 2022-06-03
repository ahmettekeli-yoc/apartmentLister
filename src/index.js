const scrapDeutscheWohnen = require('./scrappers/deutsche-wohnen');
const scrapDegewo = require('./scrappers/degewo');
const scrapHowoge = require('./scrappers/howoge');
const { scheduleJob, shutdownJob } = require('./scheduler');
const { messagePrivately } = require('./telegramBot');

const everyHour = ' 35 * * * *';
const everyMinute = '0 * * * * *';
const repeatTime = everyHour;

let degewoApartments;
let deutscheWohnenApartments;
let hogowerApartments;
let isFirstReport = true;
let message = `Here are the apartment(s) I have found: \n\n`;

async function findApartments() {
    // deutscheWohnenApartments = await scrapDeutscheWohnen();
    // degewoApartments = await scrapDegewo();
    // hogowerApartments = await scrapHowoge();
    // return [deutscheWohnenApartments, degewoApartments, hogowerApartments];
        hogowerApartments = await scrapHowoge();
    return [hogowerApartments];
}


// setTimeout(() => {
//     shutdownJob(); 
// }, 61000);

(async function () {
    const apartmentListings = await findApartments();
    if(isFirstReport){
        isFirstReport = false;
        console.log('listings',apartmentListings);
        apartmentListings.forEach(listingSource => {
            console.log('source:',listingSource)
            listingSource.apartments.forEach(apartment => {
                message += `${apartment.title} \n ${apartment.address} \n ${apartment.price} \n ${apartment.rooms} \n ${apartment.size} \n ${apartment.url} \n\n`;
            });
        });
    }
    // console.log(apartmentListings);
    scheduleJob(()=>{messagePrivately(message)}, repeatTime);
})();

/** TODO:
 *  - Daireleri bir yere kaydet.
 *  + Telegramdan mesaj gonder.
 *  - Her saat calistir. Ayni daireleri kaydetme
 *  - Yeni daire varsa telegramdan mesaj gonder.
 */
