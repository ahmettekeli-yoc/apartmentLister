const puppeteer = require('puppeteer');
const { websites, excludeWords } = require('../../sources');

const deutcheWohnen = websites[0];

async function scrapDeutcheWohnen() {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(deutcheWohnen.targetUrl);
        //retrieve page count from pagination
        const lastPageNumber = await getPageCount(page);
        let data = [];
        //looping over pages and extracting data
        for (let index = 0; index < lastPageNumber; index++) {
            // await page.waitForSelector('a[id="object-list-3"]');
            await page.waitFor(1000);
            data = data.concat(await retrieveApartments(page));

            if (index != lastPageNumber - 1) {
                await page.click('a[id="object-list-3"]');
            }
        }
        await browser.close();
        return {
            website: deutcheWohnen.name,
            date: new Date().toLocaleString(),
            apartmentCount: data.length,
            apartments: data,
        };
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

async function retrieveApartments(page) {
    return page.evaluate(() => {
        const adSelector = 'object-list__item';
        let adElements = Array.from(document.getElementsByClassName(adSelector));
        let ads = [];

        adElements.forEach((element) => {
            const title = element.children[1].children[0].innerText;
            const rooms = element.children[1].children[2].children[1].innerText.split('|')[0].split(' ')[0];
            if (!title.toLowerCase().includes('wbs')) {
                if(rooms <=1){
                    return;
                }
                ads.push({
                    title: title,
                    address: element.children[1].children[1].innerText.replace(/\s+/g, ' ').trim(),
                    price: element.children[1].children[3].innerText.replace(/\s+/g, ' ').trim(),
                    rooms: rooms + ' Zimmer',
                    size: element.children[1].children[2].children[0].innerText.split('|')[0],
                    url: element.children[1].href,
                });
            }
        });
        return ads;
    });
}

async function getPageCount(page) {
    return await page.evaluate(() => {
        const paginationSelector = 'pagination__item';
        const paginationItems = Array.from(document.getElementsByClassName(paginationSelector));
        paginationItems.shift(); //removing first item since its left arrow
        paginationItems.pop(); //removing last item since its right arrow
        return paginationItems.length;
    });
}

module.exports = scrapDeutcheWohnen;

// (async function () {
//     const data = await scrapDeutcheWohnen();
//     console.log(data);
// })();
