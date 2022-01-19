const cheerio = require('cheerio')
const root = "http://animekb.net"
const main_search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.post-thumbnail').each((index, element) => {
        let a = $(element).find('a')
        let url = a.attr('href')
        let title = a.attr('title')
        let poster = a.find('.figure-img').find('img').attr('src')
        result.push({ title, url, poster })
    });
    return result;
};
const episodes = (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let poster = $('.imgthumb').find('img').attr('src')
    let title = $('.entry-title').text().trim()
    let synopsis = $('.content-squ').find('p').text()
    $('#sidebar').find('div').each((index, element) => {
        let e = $(element)
        switch (index) {
            case 1:
                let status = e.text().toLowerCase().split(":");
                extras.push({ title: status[0].trim(), content: status[1].trim() });
                break;
            case 2:
                let texts = e.find('.textwidget').text().split("\n")
                texts.forEach(val => {
                    if (val.trim() !== "") {
                        let splitted = val.split(":");
                        extras.push({ title: splitted[0].trim(), content: splitted[1].trim() });
                    }
                });
                break;
        }
    });
    $('.content-squ').find('ul').find('li').each((index, element) => {
        categories.push($(element).find('a').text());
    });
    $('.lcclink').each((index, element) => {
        let url = element.attribs.href
        let title = element.children[0].children[0].data;
        episodes.push({ title, url })
    });
    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
    let links = []
    let $ = cheerio.load(html)
    let poster = $('.separator').find('img').attr('src');
    let title = $('.entry-title').text().trim();
    $(".botondescarga").each((index, element) => {
        let url = element.parent.attribs.href
        links.push(url);
    });
    links.splice(links.length - 1, 1);
    return { poster, title, links };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/buscar/?p=${text}&genero=all&letter=all`;
    },
    main: main_search,
    search: main_search,
    episodes: episodes,
    episode: episode
}