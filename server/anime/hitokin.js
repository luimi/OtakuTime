const cheerio = require('cheerio');
const axios = require('axios')
const root = "https://hitokin.net"
const main = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.block-link-pop').each((index, element) => {
        let a = $(element)
        let url = root + a.attr('href')
        let title = a.find('.block-content').text().replace(/\s+/g, " ").clearSpaces()
        let poster = a.find('img').attr('data-src')
        result.push({ poster: "/assets/no-image.png",title, url })
    });
    return result;
};
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.ribbon-').each((index, element) => {
        let a = $(element).find('a')
        let url = root + a.attr('href')
        let title = a.find('.block-content').find('.font-w600').text()
        let poster = a.find('img').attr('data-src')
        result.push({ poster: "/assets/no-image.png",title, url })
    });
    return result;
};
const episodes = (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let poster = $('.img-fluid').attr('data-src')
    let title = $('.anime-title').text().clearSpaces()
    let synopsis = $('.text-gray-light').text()
    $('.btn-outline-secondary').each((index, element) => {
        categories.push($(element).text().clearSpaces());
    });
    let splitedUrl = $('#facebook_wall').find('div').attr('data-href').split("/")
    let page = splitedUrl[splitedUrl.length - 1];
    $('script').each((index, element) => {
        let e = $(element)
        if (!e.attr('src') && element.children[0] && element.children[0].data && element.children[0].data.includes("\n\t\t    global.info")) {
            let data = element.children[0].data;
            data = data.replace("global.info = '';\n\t\t    var episodios = ", "").clearSpaces();
            data = data.replace(", \n\t\t\tglobal_vistos = [];", "");
            try {
                let temp = JSON.parse(data);
                temp.forEach(element => {
                    episodes.push({ title: `Episodio ${element[0]}`, url: `${root}/${element[0]}/${page}` })
                });
            } catch (e) { }
        }
    });
    return { title,poster: "/assets/no-image.png" ,synopsis, categories, extras, episodes };
};
const episode = async (html) => {
    let links = []
    let streams = []
    let next = undefined
    let previous = undefined
    let $ = cheerio.load(html)
    let title = $('h1.tv-title ').text().clearSpaces();
    let poster = $('#fondo_anime').attr('data-src')
    let episodes = undefined
    /*$('meta').each((index, element) => {
        let e = $(element)
        if(e.attr('itemprop') === "image") poster = e.attr('content')
    });*/
    $('.btn-success').each((index, element) => {
        let e = $(element)
        let onclick = e.attr('onclick')
        onclick = onclick.replace("ir_a('", "").replace("')", "")
        //links.push(onclick);
    });
    let players = []
    $('.btn-player').each((index, element) => {
        players.push($(element).attr('data-tipo'))
    });
    let player_data = ""
    $('#player-data').find('input').each((index, element) => {
        let e = $(element)
        player_data += `${index === 0 ? '' : '&'}${e.attr('name')}=${e.attr('value')}`
    });
    let splitedUrl = $('#facebook_wall').find('div').attr('data-href').split("/")
    let page = splitedUrl[splitedUrl.length - 1];
    const postPlayer = (servidor) => {
        return new Promise((res, rej) => {
            let params = new URLSearchParams();
            params.append("seccion", "reproductor");
            params.append("data", player_data);
            params.append("nombre", page);
            params.append("servidor", servidor);
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            axios.post(`${root}/reproductor.php`, params, config).then((response) => {
                if (response.data.success) {
                    response.data.html.replace("src=\"//","https://").replace(/(https?:\/\/[^\s]+)/g, (url) => {
                        streams.push(url)
                        return ""
                    })
                }
                res({ success: true })
            });
        });
    }
    for (let i = 0; i < players.length; i++) {
        await postPlayer(players[i])
    }
    episodes = $('.block-options').find('button').attr('onclick')
      .replace('window.location.href=\'',"")
      .replace('\'',"")
    
    return { title, poster: "/assets/no-image.png",links, streams, next, previous, episodes};
};

module.exports = {
    mainUrl: root + '/recientes.php',
    searchUrl: (text) => {
        return `${root}/${text}/animes.php`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}