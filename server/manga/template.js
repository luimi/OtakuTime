const cheerio = require('cheerio');
const root = "URL"
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
    let $ = cheerio.load(html)

    let result = []
    $('.class').each((index, element) => {
        let a = $(element)
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
    let $ = cheerio.load(html)

    let result = []
    $('.class').each((index, element) => {
        let a = $(element).find('a')
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
    let $ = cheerio.load(html)

    let episodes = []
    let categories = []
    let extras = []
    let poster = $('.class').attr('data-setbg')
    let title = $('.class').text()
    let synopsis = $('.class').text()
    $('.class').each((index, element) => {
        extras.push({ title: "", content: "" });
    });
    $('.class').each((index, element) => {
        categories.push($(element).text())
    });
    $('.class').each((index, element) => {
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
{title,pages:[string],next,previous,episodes}
*/
const episode = (html) => {
    let $ = cheerio.load(html)

    let pages = []
    let next = undefined
    let previous = undefined
    let title = $('.class').text();
    let episodes = undefined
    $(".class").each((index, element) => {
        let url = $(element).attr('href')
    });

    $("script").each((index, element) => {
        let e = $(element)
    });
    return { title, pages, next, previous, episodes };
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