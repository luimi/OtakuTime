const cheerio = require('cheerio');
const root = "https://nartag.com/"
const main = (html) => {
    let $ = cheerio.load(html)
    let result = []
    $('.page-item-detail').each((index, element) => {

        let e = $(element);
        let a = e.find("a");
        let btnLink = e.find('.btn-link').first()
        let url = btnLink.attr('href').encode();
        let poster = a.find('img').attr('src');
        let name = e.find('h3').find('a').text();
        let cap = btnLink.text()
        let title = name.clearSpaces() + ' - ' + cap.clearSpaces()
        if (url !== "Iw==") result.push({ title, poster, url })
    });
    return result;
};
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.row.c-tabs-item__content').each((index, element) => {

        let e = $(element);
        let a = e.find("a");

        let url = a.attr('href').encode();
        let poster = e.find('a').find('img').attr('src');
        let title = e.find('h3').text();

        result.push({ title, poster, url })
    });
    return result;
};
const episodes = async (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)

    let poster = $('.summary_image').find('img').attr('src')
    let title = $('#manga-title').find('h1').text().clearSpaces()

    let synopsis = ""
    $('.post-content_item').each((index, element) => {
        let e = $(element);
        let _title = e.find('.summary-heading').text().clearSpaces()
        let _content = e.find('.summary-content').text().replace(title, "").clearSpaces()
        if (_title && _content) extras.push({ title: _title, content: _content });

    });

    const scriptContent = $('#madara-js-js-extra').html();
    const match = scriptContent.match(/var madara = (.*?);/s);

    if (match) {
        const jsonString = match[1];
        const obj = JSON.parse(jsonString);
        let chapters = await fetch(`${obj.current_url}/ajax/chapters/?t=1`, { method: "POST" });
        chapters = await chapters.text()
        chapters = cheerio.load(chapters)
        chapters('.free-chap').each((index, element) => {
            let a = $(element).find('a')
            episodes.push({ title: a.text().clearSpaces(), url: a.attr('href').encode() })
        });
    } else {
        console.log("No se pudo convertir el objeto");
    }


    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
    let pages = []
    let next = undefined
    let previous = undefined
    let $ = cheerio.load(html)
    let title = $('#chapter-heading').text();
    let episodes = undefined
    $(".reading-content").find('img').each((index, element) => {
        let e = $(element)
        pages.push(e.attr('src').clearSpaces())
    });
    $(".breadcrumb").find("a").each((index, element) => {
        let a = $(element)
        if (index === 1) {
            episodes = a.attr('href')
        }
    });
    previous = $(".nav-previous").find("a").attr('href')
    next = $(".nav-next").find("a").attr('href')
    return { title, pages, next, previous, episodes };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/?s=${text}&post_type=wp-manga`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}