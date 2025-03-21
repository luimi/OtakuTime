const cheerio = require('cheerio');
const root = "https://tmomanga.com"
/*

  __  __       _       
 |  \/  |     (_)      
 | \  / | __ _ _ _ __  
 | |\/| |/ _` | | '_ \ 
 | |  | | (_| | | | | |
 |_|  |_|\__,_|_|_| |_|
                       
                       
{title,url,poster,chapter}
*/
const main = (html) => {
    let $ = cheerio.load(html)
    let result = []
    $('.page-listing-item').first().find(".episode_thumb").each((index, element) => {
        let a = $(element)
        let url = a.find("a").attr('href').encode()
        let title = a.find(".manga-title-updated").text().clearSpaces()
        let chapter = a.find(".manga-episode-title").text().replace("Capítulo ","").replace(".00","").clearSpaces()
        let poster = a.find('img').attr('src')
        result.push({ title, url, poster, chapter })
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
    $('.page-listing-item').first().find(".manga_biblioteca").each((index, element) => {
        let a = $(element)
        let url = a.find("a").attr('href').encode()
        let title = a.find(".manga-title-updated").text().clearSpaces()
        let poster = a.find('img').attr('src')
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
    let poster = $('.summary_image').find("img").attr('src')
    let title = $('.post-title').find("h1").text().clearSpaces()
    let synopsis = $('.summary__content').text().clearSpaces()
    $('.summary-content').last().find("a").each((index, element) => {
        categories.push($(element).text().clearSpaces())
    });
    $('.sub-chap').find("a").each((index, element) => {
        let a = $(element);
        episodes.push({ title:a.text().replace("Capítulo ","").replace(".00","").clearSpaces().trim(), url:a.attr("href").encode() })
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
    let next = $(".nav-next").find("a").attr("href")
    if(next) next = next.encode()
    let previous = $(".nav-previous").find("a").attr("href")
    if(previous) previous = previous.encode()
    let name = $('#chapter-heading').text().clearSpaces();
    let chapter = name.split(" ").pop().replace(".00","")
    let title = name.replace(` - Capítulo ${name.split(" ").pop()}`,"")
    let episodes = $(".nav-allmangas").find("a").attr("href")
    if(episodes) episodes = episodes.encode()
    $("#images_chapter").find("img").each((index, element) => {
        let url = $(element).attr('data-src')
        pages.push(`${process.env.SERVER}/image?url=${url}&server=${root}`)
    });
    return { title, pages, next, previous, episodes, chapter };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/biblioteca?search=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}