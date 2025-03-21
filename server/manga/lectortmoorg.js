const cheerio = require('cheerio');
const root = "https://lectortmo.org"
const main = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.c-blog-listing:first').find('.manga_portada').each((index, element) => {
        let e = $(element)
        let url = e.find('a').attr('href').encode()
        let title = e.find('.manga-title-updated').text()
        let chapter = e.find('.manga-episode-title').text().replace("Capítulo ","").replace(".00","").clearSpaces()
        let poster = e.find('img').attr('src')
        result.push({ title, url, poster, chapter })
    });
    return result;
};
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.manga_portada').each((index, element) => {
        let e = $(element)
        let url = e.find('h3').find('a').attr('href').encode()
        let title = e.find('h3').find('a').text()
        let poster = e.find('img').attr('src')
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
    let title = $('.post-title').find('h1').text()
    let synopsis = $('.summary__content').find('p').text()
    $('.post-content_item').each((index, element) => {
      let e = $(element)
      if(e.find('.summary-heading').find('h5').text().clearSpaces() === 'Géneros:'){
        e.find('.summary-content').find('.tags_manga').each((index,element) => {
          let i = $(element)
          categories.push(i.text().clearSpaces())
        });
      } else {
        let title = e.find('.summary-heading').text().clearSpaces().replace(":","")
        let content = e.find('.summary-content').text().clearSpaces()
        extras.push({ title: title, content: content});
      }
        
    });
    $('.list-chap').find('a').each((index, element) => {
      let a = $(element)
        episodes.push({ title:a.text().replace("Capítulo ","").replace(".00","").clearSpaces(), url:a.attr('href').encode() })
    });
    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
    let pages = []
    let next = undefined
    let previous = undefined
    let $ = cheerio.load(html)
    let name = $('#chapter-heading').text();
    let chapter = name.split(" ").pop().replace(".00","")
    let title = name.replace(` - Capítulo ${name.split(" ").pop()}`,"")
    let episodes = undefined
    $("img.img-fluid").each((index, element) => {
        let url = $(element).attr('data-src')
        pages.push(`${process.env.SERVER}/image?url=${url}&server=${root}`)
    });

    $(".nav-links:first").find('a').each((index, element) => {
        let a = $(element)
        if(a.hasClass('prev_page')){
          previous = a.attr('href').encode()
        } else if(a.hasClass('next_page')){
          next = a.attr('href').encode()
        } else if(a.hasClass('all_manga')){
          episodes = a.attr('href').encode()
        }
    });
    return { title, pages, next, previous, episodes, chapter};
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/biblioteca?search=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}