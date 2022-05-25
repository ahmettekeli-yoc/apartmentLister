const scrapDeutscheWohnen = require('./deutsche-wohnen');
const scrapDegewo = require('./degewo');
const scrapHowoge = require('./howoge');

async function findApartments() {
    const apt1 = await scrapDeutscheWohnen();
    const apt2 = await scrapDegewo();
    const apt3 = await scrapHowoge();
    return [apt1, apt2, apt3];
}

(async function () {
    const apartmentListings = await findApartments();
    console.log(apartmentListings);
})();
