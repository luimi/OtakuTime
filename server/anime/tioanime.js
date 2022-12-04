const cheerio = require('cheerio');
const root = "https://tioanime.com";
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
    $('.episodes').find(".episode").each((i, e) => {
        let a = $(e).find("a")
        let url = (root + a.attr('href')).encode()
        let title = a.find(".title").text().clearSpaces();
        let poster = root + a.find('img').attr('src');
        result.push({ title, url, poster });
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
    $('.animes').find(".anime").each((i, e) => {
        let a = $(e).find("a")
        let url = (root + a.attr('href')).encode()
        let title = a.find(".title").text().clearSpaces();
        let poster = root + a.find('img').attr('src');
        result.push({ title, url, poster });
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
    let poster = root + $('.thumb').first().find("img").attr('src');
    let title = $('.title').first().text().clearSpaces();
    let synopsis = $('.sinopsis').text().clearSpaces();
    $('.genres').find("span").each((i, e) => {
        categories.push($(e).find("a").text())
    });
    let script = $("script").last().text().clearSpaces();
    let data = script.match(/(\[.+?\])+/g);
    let animeInfo = JSON.parse(data[0]);
    let _episodes = JSON.parse(data[1]);
    _episodes.forEach((num) => {
        episodes.push({ title: num, url: `${root}/ver/${animeInfo[1]}-${num}`.encode() })
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
    let title = $('.anime-title').text().clearSpaces();
    let episodes = undefined;
    $(".modal-dialog").find("a").each((i, e) => {
        let url = $(e).attr('href')
        links.push(url);
    });

    let _streams = $("script").last().text().clearSpaces().match(/(\[\[.+?\]\])+/g);
    _streams = JSON.parse(_streams);
    _streams.forEach((server) => {
        streams.push(server[1])
    });
    $(".episodes-nav").find("a").each((i, e) => {
        let a = $(e);
        let span = a.find("span").text().clearSpaces();
        if (a.attr("href") !== "#")
            switch (span) {
                case "Episodio anterior": previous = (root + a.attr("href")).encode(); break;
                case "Listado de episodios": episodes = (root + a.attr("href")).encode(); break;
                case "Episodio siguiente": next = (root + a.attr("href")).encode(); break;
            }
    });
    return { title, links, streams, next, previous, episodes };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/directorio?q=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}