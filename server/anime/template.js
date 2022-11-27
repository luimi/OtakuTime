const cheerio = require('cheerio');
const root = "URL";
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
    $('.class').each((i, e) => {
        let a = $(e)
        let url = a.attr('href')
        let title = ""
        let poster = a.find('img').attr('src')
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
    $('.class').each((i, e) => {
        let a = $(e).find('a')
        let url = a.attr('href')
        let title = $(element).find('a').text()
        let poster = $(element).attr('data-setbg')
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
    let poster = $('.class').attr('data-setbg');
    let title = $('.class').text();
    let synopsis = $('.class').text();
    $('.class').each((i, e) => {
        extras.push({ title: "", content: "" });
    });
    $('.class').each((i, e) => {
        categories.push($(e).text())
    });
    $('.class').each((i, e) => {
        episodes.push({ title:"", url:"" })
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
{poster,title,links:[string],streams:[string],next,previous,episodes}
*/
const episode = (html) => {
    let $ = cheerio.load(html)

    let links = [];
    let streams = [];
    let poster = undefined;
    let next = undefined;
    let previous = undefined;
    let title = $('.class').text();
    let episodes = undefined;
    $(".class").each((i, e) => {
        let url = $(e).attr('href')
        links.push(url);
    });

    $("script").each((i, e) => {
        let el = $(e)
        streams.push(el.text())
    });
    return { poster, title, links, streams, next, previous , episodes};
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