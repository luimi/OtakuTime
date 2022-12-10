const cheerio = require('cheerio');
const root = "https://zenkimex.com.mx";
/*

  __  __       _       
 |  \/  |     (_)      
 | \  / | __ _ _ _ __  
 | |\/| |/ _` | | '_ \ 
 | |  | | (_| | | | | |
 |_|  |_|\__,_|_|_| |_|
                       
                       
{title,url,poster}
*/
const main = (html) => {
    let $ = cheerio.load(html);

    let result = [];
    $('.contenedor-capitulos').each((i, e) => {
        let a = $(e).find(".metadata").find("a");
        let url = (root + a.attr('href')).encode()
        let title = a.find("h6").text().clearSpaces();
        let poster = $(e).find('.poster-p').attr('data-src')
        result.push({ title, url, poster })
    });
    return result;
};
/*

   _____                     _     
  / ____|                   | |    
 | (___   ___  __ _ _ __ ___| |__  
  \___ \ / _ \/ _` | '__/ __| '_ \ 
  ____) |  __/ (_| | | | (__| | | |
 |_____/ \___|\__,_|_|  \___|_| |_|
                                   
                                   
{title,url,poster}
*/
const search = (html) => {
    let $ = cheerio.load(html);

    let result = [];
    $('.zen-cont-avanzado-serie').find("a").each((i, e) => {
        let a = $(e);
        let url = (root + a.attr('href')).encode()
        let title = a.find('.zen-item-avanzado').find("span").text().clearSpaces();
        let poster = a.find('.zen-item-avanzado').attr('style').match(/url\('(.*?)'/g)[0].replace("url('", "").replace("'", "");
        result.push({ title, url, poster })
    });
    return result;
};
/*

  ______       _               _           
 |  ____|     (_)             | |          
 | |__   _ __  _ ___  ___   __| | ___  ___ 
 |  __| | '_ \| / __|/ _ \ / _` |/ _ \/ __|
 | |____| |_) | \__ \ (_) | (_| |  __/\__ \
 |______| .__/|_|___/\___/ \__,_|\___||___/
        | |                                
        |_|                                
{title,poster,episodes:[{title,url}],categories:[string],extras:[{title,content}]}
*/
const episodes = (html) => {
    let $ = cheerio.load(html);
    let episodes = [];
    let categories = [];
    let extras = [];
    let poster = $('.zen-poster').attr('style').match(/url\('(.*?)'/g)[0].replace("url('", "").replace("'", "");
    let title = $('.zen-cap-name').text().clearSpaces();
    let synopsis = $('.zen-cap-sinopsis').text().clearSpaces();
    $('.zen-cap-genero').each((i, e) => {
        categories.push($(e).text().clearSpaces())
    });
    $('#listingTable').find("a").each((i, e) => {
        let a = $(e);
        episodes.push({ title: a.find("span").text(), url: root + a.attr("href") });
    });
    $("script").each((i, e) => {
        let code = $(e).text().clearSpaces();
        if (code.includes("objJson = ")) {
            let match = code.match(/\[(.+?)\];/g);
            let _episodes = match[0].replace(";","")
              .replace(/id:/g, "\"id\":")
                .replace(/poster:/g, "\"poster\":")
                .replace(/title:/g, "\"title\":");
            _episodes = JSON.parse(_episodes);
            _episodes.forEach((episode) => {
              let _title = episode.title.replace(title,"").clearSpaces();
                episodes.push({ title: _title , url: `${root}/animes/ver/${episode.id}`.encode() })
            });
        }
    });
    return { poster, title, synopsis, categories, extras, episodes };
};
/*

  ______       _               _      
 |  ____|     (_)             | |     
 | |__   _ __  _ ___  ___   __| | ___ 
 |  __| | '_ \| / __|/ _ \ / _` |/ _ \
 | |____| |_) | \__ \ (_) | (_| |  __/
 |______| .__/|_|___/\___/ \__,_|\___|
        | |                           
        |_|                           
{title,links:[string],strams:[string],next,previous,episodes}
*/
const episode = (html) => {
    let $ = cheerio.load(html)

    let links = [];
    let streams = [];
    let next = undefined;

    let previous = undefined;
    let title = $('.zen-video-titulo').text().clearSpaces();
    let poster = $(".zen-contendor-video").attr("style").match(/url\('(.*?)'/g)[0].replace("url('", "").replace("'", "");
    let episodes = (root + $(".zen-btn-cap").find("a").attr("href")).encode();
    $(".tabla_descarga").find("a").each((i, e) => {
        let url = $(e).attr('href')
        links.push(url);
    });
    return { poster, title, links, streams, next, previous, episodes };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/search/1?terminos=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}