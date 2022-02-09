const cheerio = require('cheerio');
const axios = require("axios");
const root = "https://manga-templo.com"
const main = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.card-series-grid').find('.grid-item-series').each((index, element) => {
        let e = $(element)
        let url = root + e.find('.text-hover-primary').attr('href')
        let title = `${e.find('p').text()} - ${e.find('.reverse').text()}`
        let poster = e.find('img').attr('data-src')
        result.push({ title, url, poster })
    });
    return result;
};
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.grid-item-series').each((index, element) => {
        let e = $(element)
        let url = root + e.find('a').attr('href')
        let title = e.find('p').text()
        let poster = e.find('img').attr('data-src')
        result.push({ title, url, poster })
    });
    return result;
};
const episodes = (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let poster = $('.img-fluid').attr('src')
    let title = $('.card-body').find('h1').text()
    let synopsis = $('.card-body').find('p').text()
    $('.card-list-chapter').find('a').each((index, element) => {
      let a = $(element)
      let h5 = a.find('h5')
      h5.find('.text-muted').remove()
      episodes.push({ title:h5.text().trim(), url:root + a.attr('href') })
    });
    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = async (html) => {
    let pages = []
    let next = undefined
    let previous = undefined
    let $ = cheerio.load(html)
    let titles = $('.container-page').find('h3').text().split(" - ")
    let title = `${titles[0]} - ${titles[1]}`;
    let img = $('.img-fluid').attr('src')
    pages.push(img)
    let getNextImage = async (url) => {
      try {
        
        let html = await axios.get(root+url);
        html = html.data
        let $ = cheerio.load(html);
        let img = $('.img-fluid').attr('src')
        pages.push(img)
        if($('.btn-next')){
          await getNextImage($('.btn-next').attr('href'))
        }
      } catch (e) {}
    }
    await getNextImage($('.btn-next').attr('href'))
    return { title, pages, next, previous };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/search?q=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}