const cheerio = require('cheerio');
const root = "https://ytanime.tv/";
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
    $(".video-card").each((i, e) => {
        let vc = $(e);
        let poster = vc.find(".img-fluid").attr("src");
        let url = vc.find(".play-icon").attr("href").encode();
        let title = vc.find(".video-title").find("a").text().clearSpaces();
        result.push({ poster, url, title });
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
    $(".video-card").each((i, e) => {
        let vc = $(e);
        let poster = vc.find(".img-fluid").attr("src");
        let url = vc.find(".play-icon").attr("href").encode();
        let title = vc.find(".video-title").find("a").text().clearSpaces();
        result.push({ poster, url, title });
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
    let poster = $('.sa-poster__fig').find("img").attr('src');
    let title = $('.sa-title-series__title-txt').text().clearSpaces();
    let synopsis = $('.sa-text.sa-text--w-light.ng-binding').text().clearSpaces();
    $('.list-group-item').each((i, e) => {
        let a = $(e).find("a");
        episodes.push({ title: a.find(".sa-series-link__number").text(), url: a.attr("href").encode() })
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
    let title = $('.Title-epi').text().clearSpaces();
    let episodes = undefined;
    $("#downcontainer").find("a").each((i, e) => {
        let url = $(e).attr("href")
        links.push(url);
    });
    $(".btn.btn-primary").each((i, e) => {
        let a = $(e)
        if (a.text().includes("Anterior")) previous = a.attr("href").encode();
        if (a.text().includes("Siguiente")) next = a.attr("href").encode();
        if (a.text().includes("Lista")) episodes = a.attr("href").encode();
    });
    streams.push($("iframe").attr("src"));
    return { title, links, streams, next, previous, episodes };
};

module.exports = {
    mainUrl: `${root}/ultimos-capitulos`,
    searchUrl: (text) => {
        return `${root}/search?q=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}