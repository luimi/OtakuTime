const cheerio = require('cheerio');
const root = "https://jkanime.net"
const main = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.listadoanime-home').find('a').each((index, element) => {
        let a = $(element)
        let url = a.attr('href')
        let title_group = a.find('.anime__sidebar__comment__item__text')
        let title = `${title_group.find('h5').text()} - ${title_group.find('h6').text().clearSpaces()}`
        let poster = a.find('img').attr('src')
        result.push({ title, url, poster })
    });
    return result;
};
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.anime__item').each((index, element) => {
        let a = $(element).find('a')

        let url = a.attr('href')
        let title = $(element).find('.anime__item__text').find('a').text()
        let poster = $(element).find('.anime__item__pic').attr('data-setbg')
        result.push({ title, url, poster })
    });
    return result;
};
const episodes = (html) => {
    //https://jkanime.net/ajax/pagination_episodes/201/83/
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let poster = $('.anime__details__pic').attr('data-setbg')
    let title = $('.anime__details__title').find('h3').text()
    let synopsis = $('.anime__details__text').find('p:first').text()
    $('.anime__details__widget').find('li').each((index, element) => {
        let e = $(element);
        if (index === 1) {
            e.find('a').each((_index, _element) => {
                categories.push($(_element).text())
            });
        } else {
            let extra = e.text().split(":");
            extras.push({ title: extra[0].clearSpaces(), content: extra[1].clearSpaces() });
        }
    });
    let _root
    $('meta').each((index, element) => {
        let e = $(element);
        if (e.attr('property') === 'og:url') {
            _root = e.attr('content');
        }
    });
    if (_root) {
        let total = parseInt($('.numbers:last').text().split("-")[1].clearSpaces())

        for (let i = total; i > 0; i--) {
            let url = `${_root}${i}`
            let title = `Capítulo ${i}`
            episodes.push({ title, url })
        }
    }

    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
    let links = []
    let streams = []
    let next = undefined
    let previous = undefined
    let $ = cheerio.load(html)
    let title = $('.breadcrumb__links').find('h1').text().clearSpaces();
    let episodes = undefined
    $("table").find('a').each((index, element) => {
        let url = $(element).attr('href')
        links.push(url);
    });

    $("script").each((index, element) => {
        let e = $(element)
        if (!e.attr('src') && element.children[0] && element.children[0].data && element.children[0].data.includes('iframe')) {
            element.children[0].data.replace(/(https?:\/\/[^\s]+)/g, (url) => {
                streams.push(url)
                return ""
            })
        }
    });
    let getUrlEpisode = (url) => {
        let divided = url.split("/");
        return parseInt(divided[divided.length-2]);
    }
    let _root
    $('meta').each((index, element) => {
        let e = $(element);
        if (e.attr('property') === 'og:url') {
            _root = e.attr('content');
        }
    });
    let _rootNumber = getUrlEpisode(_root);
    $('.justify-content-start').find('a.videonav').each((index,element) => {
        let url = $(element).attr('href')
        let cn = getUrlEpisode(url)
        if(cn && cn > _rootNumber){
            next = url;
        } else if(cn && cn < _rootNumber) {
            previous = url
        }
    })
    episodes = $('.justify-content-start').find('div.col-lg-2').find('a').attr('href')
    return { title, links, streams, next, previous, episodes};
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