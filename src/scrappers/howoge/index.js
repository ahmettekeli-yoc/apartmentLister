const puppeteer = require('puppeteer');
const { websites, excludeWords } = require('../../sources');

const howoge = websites[2];

async function scrapHowoge() {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(howoge.targetUrl);
        //retrieve page count from pagination
        const lastPageNumber = await getPageCount(page);
        let data = [];
        //looping over pages and extracting data
        for (let index = 0; index < lastPageNumber; index++) {
            await page.waitFor(1000);
            data = data.concat(await retrieveApartments(page));

            if (lastPageNumber > 1 && index != lastPageNumber - 1) {
                await page.waitFor(1000);
                await page.click('li[class="pagination--page-next"]');
            }
        }
        await browser.close();
        return {
            website: howoge.name,
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
        const adSelector = 'flat-single';
        let adElements = Array.from(document.getElementsByClassName(adSelector));
        let ads = [];
        adElements.forEach((element) => {
            const title = element.children[1].children[0].innerText;
            //handle wbs situation here "ohne wbs" and "wbs" difference is important
            if (title.toLowerCase().includes('ohne wbs') || !title.toLowerCase().includes('wbs')) {
                if (!Array.from(element.classList).includes('flat-single-teaser')) {
                    let apartmentData;
                    apartmentData = {
                        title: title,
                        address: element.children[1].children[2].innerText,
                        distrcit: element.children[1].children[1].innerText,
                        price: element.children[1].children[3].children[0].children[0].children[0].innerText
                            .replace(/\s+/g, ' ')
                            .trim(),
                        rooms: element.children[1].children[3].children[0].children[0].children[2].innerText
                            .replace(/\s+/g, ' ')
                            .trim(),
                        size: element.children[1].children[3].children[0].children[0].children[1].children[1].innerText,
                        url: element.children[1].children[2].children[0].href,
                    };

                    ads.push(apartmentData);
                }
            }
        });
        return ads;
    });
}

async function getPageCount(page) {
    return await page.evaluate(() => {
        const paginationSelector = 'pagination--page-item';
        const paginationItems = Array.from(document.getElementsByClassName(paginationSelector));
        return paginationItems.length;
    });
}

module.exports = scrapHowoge;

(async function () {
    const data = await scrapHowoge();
    console.log(data);
})();
