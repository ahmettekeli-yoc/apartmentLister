const puppeteer = require('puppeteer');
const { websites, excludeWords } = require('../../sources');

const vonovia = websites[3];

async function scrapVonovia() {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(vonovia.targetUrl);
        // Turn on google toggle on thw website in order to see the listings.
        await page.evaluate(()=>{
            const googleToggle = Array.from(document.getElementsByClassName('toggle-button__wrapper'))[1];
            googleToggle.click();
        })
        await page.waitFor(5000);
        await page.screenshot({path: 'screenshot.png', fullPage: true});
        //retrieve page count from pagination
        const lastPageNumber = await getPageCount(page);
        let data = [];
        //looping over pages and extracting data
        for (let index = 0; index < lastPageNumber; index++) {
            await page.waitFor(1000);
            data = data.concat(await retrieveApartments(page));

            if (index != lastPageNumber - 1) {
                await page.click('button[class="next"]');
            }
        }
        await browser.close();
        return {
            website: vonovia.name,
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
        const adSelector = 'molecule-result-list-item';
        let adElements = Array.from(document.getElementsByClassName(adSelector));
        let ads = [];
        adElements.forEach((element) => {
            const title = element.children[1].children[0].children[1].children[0].children[0].innerText;
            // const withWbs = element.children[0].children[1].children[4].children[3] ? true : false;
            const withWbs = true;
            if (!title.toLowerCase().includes('wbs') && !withWbs) {
                let apartmentData;
                apartmentData = {
                    title,
                    address: element.children[1].children[0].children[1].children[0].children[1].innerText,
                    price:
                        element.children[1].children[1].children[0].children[0].children[0].innerText +
                        ' ' +
                        element.children[1].children[1].children[0].children[0].children[1].innerText,
                    rooms: element.children[1].children[1].children[0].children[2].children[0].innerText + 'Zimmer',
                    size: element.children[1].children[1].children[0].children[1].children[0].innerText,
                    url: element.children[1].children[0].children[0].href,
                };
                ads.push(apartmentData);
            }
        });
        return ads;
    });
}

async function getPageCount(page) {
    await page.waitFor(2000);
    return await page.evaluate(() => {
        const paginationParentSelector = 'atom-pagination pagination';
        const paginationParent = Array.from(document.getElementsByClassName(paginationParentSelector))[0];
        let pages = [];
        if(paginationParent && paginationParent.length > 0){
            pages = paginationParent.children[2].children;
        }
        return pages.length;
    });
}

(async function () {
    const data = await scrapVonovia();
    console.log(data);
})();

module.exports = scrapVonovia;
