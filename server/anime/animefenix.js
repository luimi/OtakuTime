const cheerio = require('cheerio');
const root = "https://www.animefenix.com"
const main = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.capitulos-grid').find('.overarchingdiv').each((index, element) => {
        let a = $(element).find('a')
        let url = a.attr('href')
        let title = a.attr('title')
        let poster = a.find('img').attr('src')
        result.push({ title, url, poster })
    });
    return result;
};
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.list-series').find('.serie-card').each((index, element) => {
        let a = $(element).find('a')
        let url = a.attr('href')
        let title = $(element).find('a').text().trim()
        let poster = a.find('img').attr('src')
        result.push({ title, url, poster })
    });
    return result;
};
const episodes = (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let poster = $('.image').find('img').attr('src')
    let title = $('h1.title:first').text()
    let synopsis = $('.sinopsis').text()
    $('.has-text-light').find('li').each((index, element) => {
      let text = $(element).text()
      try{
        let splited = text.split(":")
        extras.push({ title: splited[0], content: splited[1].trim() })
      }catch(e){}
        
    });
    $('.genres').find('a').each((index, element) => {
        categories.push($(element).text())
    });
    $('.anime-page__episode-list').find('li').each((index, element) => {
      let a = $(element).find('a')
      let url = a.attr('href')
      let title = a.find('span').text()
      episodes.push({ title, url })
    });
    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
    let poster
    let links = []
    let streams = []
    let next = undefined
    let previous = undefined
    let $ = cheerio.load(html)
    let title = $('.title:first').text().trim();
    $("meta").each((index, element) => {
      let e = $(element)
      if(e.attr('property') === 'og:image' && !poster){
        let url = e.attr('content')
        poster = url
        //links.push(url);
      }
        
    });

    $("script").each((index, element) => {
        let e = $(element)
        if (!e.attr('src') && element.children[0] && element.children[0].data && element.children[0].data.includes('iframe')) {
            element.children[0].data.replace(/(https?:\/\/[^\s]+)/g, (url) => {
                url = url.replace(/amp;/g,"").replace('\'',"")
                url = decodeURI(url)
                streams.push(url)
                return ""
            })
        }
    });
    $("a.is-fullwidth").each((index,element) => {
        let e = $(element)
        let url = e.attr('href')
        if(e.find('i').hasClass('fa-arrow-circle-left')){
          previous = url
        } else {
          next = url 
        }
    });
    return { title, poster,links, streams, next, previous };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/animes?q=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}