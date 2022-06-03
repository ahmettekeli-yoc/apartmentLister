const puppeteer = require('puppeteer');
const { websites, excludeWords } = require('../../sources');

const degewo = websites[1];

async function scrapDegewo() {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(degewo.targetUrl);
        //scroll to the bottom.
        await page.screenshot({ path: 'fullpage.png', fullPage: true });
        //retrieve page count from pagination
        const lastPageNumber = await getPageCount(page);
        let data = [];
        //looping over pages and extracting data
        for (let index = 0; index < lastPageNumber; index++) {
            await page.waitFor(1000);
            data = data.concat(await retrieveApartments(page));

            if (index != lastPageNumber - 1) {
                await page.click('a[class="pager__next pager__page-link"]');
            }
        }
        await browser.close();
        return {
            website: degewo.name,
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
        const adSelector = 'article-list__item article-list__item--immosearch';
        let adElements = Array.from(document.getElementsByClassName(adSelector));
        let ads = [];
        adElements.forEach((element) => {
            const title = element.children[0].children[1].children[2].innerText;
            const withWbs = element.children[0].children[1].children[4].children[3] ? true : false;
            if (!title.toLowerCase().includes('wbs') && !withWbs) {
                let apartmentData;
                if (Array.from(element.children[0].children[1].children[3].classList).includes('article__tags')) {
                    apartmentData = {
                        title: title,
                        address: element.children[0].children[1].children[1].innerText,
                        price: element.children[0].children[1].children[5]
                            ? element.children[0].children[1].children[5].innerText
                            : 0,
                        rooms: element.children[0].children[1].children[4].children[0].innerText.split('|')[0],
                        size: element.children[0].children[1].children[4].children[1].innerText.split('|')[0],
                        url: element.children[0].href,
                    };
                } else {
                    apartmentData = {
                        title: title,
                        address: element.children[0].children[1].children[1].innerText,
                        price: element.children[0].children[1].children[4].innerText,
                        rooms: element.children[0].children[1].children[3].children[0].innerText.split('|')[0],
                        size: element.children[0].children[1].children[3].children[1].innerText.split('|')[0],
                        url: element.children[0].href,
                    };
                }
                ads.push(apartmentData);
            }
        });
        return ads;
    });
}

async function getPageCount(page) {
    return await page.evaluate(() => {
        const paginationSelector = 'pager__page';
        const paginationItems = Array.from(document.getElementsByClassName(paginationSelector));
        paginationItems.pop(); //removing last item since its right arrow
        return paginationItems.length;
    });
}

// (async function () {
//     const data = await scrapDegewo();
//     console.log(data);
// })();

module.exports = scrapDegewo;
