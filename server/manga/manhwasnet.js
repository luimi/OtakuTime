const cheerio = require('cheerio');
const root = "https://manhwas.net"
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
    let section = $('.d-flex.justify-content-center')[3]
    $(section).find(".col-6.col-sm-6.col-md-6.col-xl-3").each((i, e) => {
        let url = $(e).find(".series-link").attr("href")
        let title = $(e).find(".series-box").text().clearSpaces() + " - " + $(e).find(".series-badge").text().clearSpaces();
        let poster = process.env.SERVER + "/image?url=" +$(e).find(".thumb-img").attr("src");
        result.push({ title, url, poster })
    })
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
    $('.col-6.col-sm-6.col-md-4.col-xl-2').each((index, element) => {
        let url = $(element).find(".series-link").attr("href")
        let title = $(element).find(".series-box").text().clearSpaces()
        let poster = process.env.SERVER + "/image?url=" +$(element).find(".thumb-img").attr("src");
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
    let poster = process.env.SERVER + "/image?url=" +$('.summary_image').find("img").attr('src');
    let title = $('.post-title').find("h1").text().clearSpaces();
    let synopsis = undefined;
    $(".summary_content").find(".post-content_item").each((i, e) => {
        switch (i) {
            case 0:
            case 2:
            case 4:
            case 5:
                let title = $(e).find(".summary-heading").text().clearSpaces();
                let content = $(e).find(".summary-content").text().clearSpaces();
                extras.push({ title, content });
                break;
            case 1:
                $(e).find(".summary-content").find("a").each((_i, _e) => {
                    categories.push($(_e).text().clearSpaces());
                });
                break;
            case 3:
                synopsis = $(e).find(".summary-content").text().clearSpaces();
        }
    });
    $('.main').find("li").find("a").each((index, element) => {
        let a = $(element);
        episodes.push({ title: a.find(".chapter-manhwa-title").text().clearSpaces(), url: a.attr("href") })
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
    let title = $('#chapter-heading').text().clearSpaces();
    let episodes = undefined
    $(".nav-links").first().find(".free-chap").find("a").each((i, e) => {
        let text = $(e).text().clearSpaces();
        switch (text) {
            case "Anterior": previous = $(e).attr("href"); break;
            case "Lista": episodes = $(e).attr("href"); break;
            case "Siguiente": next = $(e).attr("href"); break;
        }
    });
    $("#chapter_imgs").find("img").each((index, element) => {
        let url = $(element).attr('src')
        pages.push(url);
    });
    return { title, pages, next, previous, episodes };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/biblioteca?buscar=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}