const cheerio = require('cheerio')
const root = "https://www.animeid.tv";

const main = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('article').each((index, element) => {
        let a = $(element).find('a')
        let url = root + a.attr('href')
        url = url.encode()
        let name = a.find('header').text()
        let chapter = name.split("#").pop()
        let title = name.replace(`#${chapter}`,"").trim()
        if (title !== "") {
            let poster = a.find('figure').find('img').attr('src')
            result.push({ title, url, poster, chapter })
        }
    });
    return result;
}
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('article').each((index, element) => {
        let a = $(element).find('a')
        let url = root + a.attr('href')
        url = url.encode()
        let title = a.find('header').text()
        if (title !== "") {
            let poster = a.find('figure').find('img').attr('src')
            result.push({ title, url, poster })
        }
    });
    return result;
}
const episodes = (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let poster = $('figure').find('img').attr('src')
    let title = $('hgroup').find('h1').text();
    let synopsis = $('.sinopsis').text();
    $('.tag').each((index, element) => {
        categories.push($(element).text())
    });
    $('.status-left').find('.cuerpo').find('div').each((index, element) => {
        let e = $(element);
        extras.push({ title: e.find('strong').text().replace(":", "").clearSpaces(), content: e.find('span').text().clearSpaces() });
    })
    $('#listado').find('a').each((index, element) => {
        let a = $(element)
        let url = root + a.attr('href');
        url = url.encode();
        let title = a.find('strong').text().replace("Capítulo ","").trim();
        episodes.push({ title, url })
    });
    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
    let links = []
    let streams = []
    let next = undefined
    let previous = undefined
    let $ = cheerio.load(html)
    let info = $('#infoanime')
    let poster = info.find('figure').find('img').attr('src');
    let name = info.find('h1');
    let chapter = name.find('strong').text().replace("Capítulo ","").trim();
    let title = name.text().replace(`» Capítulo ${chapter}`,"").trim();
    let episodes = undefined
    $('.subtab').each((index, element) => {
        let data = $(element).find('.parte').attr("data");
        let datas = data.split('\\u0022');
        datas.forEach(val => {
            if(val.includes("http")){
                streams.push(val.replace(/\\/g,""));
            }
        })
    });
    $('.buttons').find('a').each((index,element) => {
        let path = $(element).attr('href')
        let url = `${root}${path}`.encode()
        if(path !== "javascript:void(0);")
        switch(index){
            case 0:
                previous = url;
                break;
            case 1:
                episodes = url
                break;
            case 2:
                next = url
                break;
        }
    });
    return { poster, title, streams, next, previous, episodes, chapter};
};
module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/buscar?q=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}