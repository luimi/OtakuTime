const cheerio = require('cheerio');
const root = "https://nartag.com"
const main = (html) => {
    let $ = cheerio.load(html)
    let result = []
    $('#loop-content').find(".page-item-detail").each((index, element) => {
        let e = $(element)
        let a = e.find("a")
        let url = e.find('.chapter-item').first().find('a').attr('href')
        let title = e.find('.post-title').text().clearSpaces() + " - " + e.find('.chapter-item').first().text().clearSpaces()
        let poster = process.env.SERVER + "/image?url=" + e.find('img').attr('src')
        if(url!=="#" && e.find('img').attr('src') && !e.text().toLowerCase().includes("novela"))
        result.push({ title, url, poster })
    });
    return result;
};
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.c-tabs-item__content').each((index, element) => {
        let e = $(element)
        let a = e.find('.post-title').find('a')
        let url = a.attr('href')
        let title = a.text().clearSpaces()
        let poster = process.env.SERVER + "/image?url=" + e.find('img').attr('src')
        if(e.find('img').attr('src'))
        result.push({ title, url, poster })
    });
    return result;
};
const episodes = (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let poster = $('.summary_image').find('img').attr('src')
    let title = $('.manga-title').find('h1').text().clearSpaces()
    let synopsis = ""
    $('.post-content_item').each((index, element) => {
        let e = $(element);
        let _title = e.find('.summary-heading').text().clearSpaces()
        let _content = e.find('.summary-content').text().replace(title,"").clearSpaces()
        if(title === "Genre(s)") {
          categories = _content.replace(/\s/g,"").split(",")
        } else {
          extras.push({ title: _title, content: _content });
        }
        
    });
    $('.wp-manga-chapter').each((index, element) => {
        let a = $(element).find('a')
        episodes.push({ title:a.text().clearSpaces(), url:a.attr('href') })
    });
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
        pages.push(e.attr('data-src').clearSpaces())
    });
    $(".breadcrumb").find("a").each((index,element) => {
        let a = $(element)
        if(index === 1){
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