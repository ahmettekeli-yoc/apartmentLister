const websites = [
    {
        name: 'deutche-wohnen',
        baseUrl: 'https://www.deutsche-wohnen.com/',
        targetUrl:
            'https://www.deutsche-wohnen.com/immobilienangebote#commercializationType=rent&utilizationType=flat,retirement&location=Berlin&city=Berlin&locale=de',
    },
    {
        name: 'degewo',
        baseUrl: 'https://www.degewo.de/',
        targetUrl:
            'https://immosuche.degewo.de/de/search?size=10&page=1&property_type_id=1&categories%5B%5D=1&lat=&lon=&area=&address%5Bstreet%5D=&address%5Bcity%5D=&address%5Bzipcode%5D=&address%5Bdistrict%5D=&address%5Braw%5D=&district=&property_number=&price_switch=true&price_radio=1200-warm&price_from=&price_to=&qm_radio=custom&qm_from=40&qm_to=&rooms_radio=custom&rooms_from=1&rooms_to=3&wbs_required=&order=rent_total_without_vat_asc',
        targetUrl2:
            'https://immosuche.degewo.de/de/search?size=10&page=1&property_type_id=1&categories%5B%5D=1&lat=&lon=&area=&address%5Bstreet%5D=&address%5Bcity%5D=&address%5Bzipcode%5D=&address%5Bdistrict%5D=&district=33%2C+46%2C+3%2C+2%2C+28%2C+29%2C+71%2C+64&property_number=&price_switch=true&price_radio=null&price_from=&price_to=&qm_radio=null&qm_from=&qm_to=&rooms_radio=custom&rooms_from=2&rooms_to=3&wbs_required=&order=rent_total_without_vat_asc',
    },
    {
        name: 'howoge',
        baseUrl: 'https://www.howoge.de/',
        targetUrl:
            'https://www.howoge.de/wohnungen-gewerbe/wohnungssuche.html?tx_howsite_json_list%5Bpage%5D=1&tx_howsite_json_list%5Blimit%5D=12&tx_howsite_json_list%5Blang%5D=&tx_howsite_json_list%5Bkiez%5D%5B%5D=Friedrichsfelde&tx_howsite_json_list%5Bkiez%5D%5B%5D=Alt-Lichtenberg&tx_howsite_json_list%5Bkiez%5D%5B%5D=Karlshorst&tx_howsite_json_list%5Bkiez%5D%5B%5D=Pankow&tx_howsite_json_list%5Bkiez%5D%5B%5D=99&tx_howsite_json_list%5Bkiez%5D%5B%5D=Buch&tx_howsite_json_list%5Bkiez%5D%5B%5D=Alt-Hohensch%C3%B6nhausen&tx_howsite_json_list%5Bkiez%5D%5B%5D=Neu-Hohensch%C3%B6nhausen&tx_howsite_json_list%5Bkiez%5D%5B%5D=Marzahn&tx_howsite_json_list%5Bkiez%5D%5B%5D=Fennpfuhl&tx_howsite_json_list%5Bkiez%5D%5B%5D=Treptow-K%C3%B6penick&tx_howsite_json_list%5Brent%5D=1200&tx_howsite_json_list%5Barea%5D=&tx_howsite_json_list%5Brooms%5D=2&tx_howsite_json_list%5Bwbs%5D=all-offers',
    },
    {
        name: 'vonovia',
        baseUrl: 'https://www.vonovia.de',
        targetUrl:
            'https://www.vonovia.de/de-de/immobiliensuche?rentType=miete&immoType=wohnung&city=10405%20Berlin,%20Almanya&perimeter=15&priceMaxRenting=1100&priceMinRenting=0&sizeMin=45&sizeMax=0&minRooms=1&dachgeschoss=0&erdgeschoss=0&lift=0&balcony=0&sofortfrei=0&disabilityAccess=0&subsidizedHousingPermit=0',
    },
];

module.exports = {
    excludeWords: ['wbs'],
    websites,
};
