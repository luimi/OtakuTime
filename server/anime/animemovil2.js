const cheerio = require('cheerio');
const root = "https://animemovil2.com";
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
    $('.grid-animes').find("article").each((i, e) => {
        let a = $(e)
        let url = root + a.find("a").attr('href')
        let title = a.find(".article-title").text().clearSpaces();
        let poster = a.find('.skeleton').attr('src')
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
    $('.grid-animes').find("article").each((i, e) => {
        let a = $(e).find("a");
        let url = root + a.attr('href');
        let title = a.find("p").last().text().clearSpaces();
        let poster = a.find('.skeleton').attr('src');
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
    let poster = $('#anime_image').attr('src');
    let title = $('.titles').text().clearSpaces();
    let synopsis = $('.sinopsis').text().clearSpaces();
    $('.generos-wrap').find("a").each((i, e) => {
        categories.push($(e).text().clearSpaces());
    });
    $('.episodios').find("li").each((i, e) => {
        let a = $(e).find("a").first();
        episodes.push({ title: a.find("p").text().clearSpaces(), url: root + a.attr("href") });
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
    let title = $('.titulo-episodio').find("h1").text().clearSpaces();
    let episodes = undefined;
    $(".descargas").find("a").each((i, e) => {
        let url = $(e).attr('href');
        links.push(url);
    });

    $(".fuentes-lista").find("button").each((i, e) => {
        let url = $(e).attr("data-url").replace("https://re.animepelix.net/redirect.php?id=", "");
        streams.push(url);
    });
    $(".botonera").find("a").each((i, e) => {
        let icon = $(e).find("i").attr("class").replace("fas ", "").replace("fa ", "");
        switch (icon) {
            case "fa-align-justify": episodes = root + $(e).attr("href"); break;
            case "fa-chevron-right": next = root + $(e).attr("href"); break;
            case "fa-chevron-left": previous = root + $(e).attr("href"); break;
        }
    });
    return { title, links, streams, next, previous, episodes };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/directorio/?q=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}