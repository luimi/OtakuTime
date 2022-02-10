const cheerio = require('cheerio');
const root = "URL"
const main = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.class').each((index, element) => {
        let a = $(element)
        let url = a.attr('href')
        let title = ""
        let poster = a.find('img').attr('src')
        result.push({ title, url, poster })
    });
    return result;
};
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.class').each((index, element) => {
        let a = $(element).find('a')
        let url = a.attr('href')
        let title = $(element).find('a').text()
        let poster = $(element).attr('data-setbg')
        result.push({ title, url, poster })
    });
    return result;
};
const episodes = (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let poster = $('.class').attr('data-setbg')
    let title = $('.class').text()
    let synopsis = $('.class').text()
    $('.class').each((index, element) => {
        extras.push({ title: "", content: "" });
    });
    $('.class').each((index, element) => {
        categories.push($(element).text())
    });
    $('.class').each((index, element) => {
        episodes.push({ title:"", url:"" })
    });
    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
    let links = []
    let streams = []
    let next = undefined
    let previous = undefined
    let $ = cheerio.load(html)
    let title = $('.class').text();
    let episodes = undefined
    $(".class").each((index, element) => {
        let url = $(element).attr('href')
        links.push(url);
    });

    $("script").each((index, element) => {
        let e = $(element)
        streams.push(e.text())
    });
    return { title, links, streams, next, previous , episodes};
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/buscar/${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}