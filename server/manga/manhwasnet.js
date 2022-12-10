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
    $("section").not(".mt-5").not(".movies").find("article").each((i, e) => {
        let url = $(e).find("a").first().attr("href").encode()
        let title = $(e).find(".title").text().clearSpaces() + " - " + $(e).find(".anime-type-peli").text().clearSpaces();
        let poster = process.env.SERVER + "/image?url=" + $(e).find("img").attr("src");
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
    $("article").each((i, e) => {
        let url = $(e).find("a").first().attr("href").encode()
        let title = $(e).find(".title").text().clearSpaces();
        let poster = process.env.SERVER + "/image?url=" + $(e).find("img").attr("src");
        result.push({ title, url, poster })
    })
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
    let poster = process.env.SERVER + "/image?url=" + $('.thumb').find("img").attr('src');
    let title = $('h1.title').text().clearSpaces();
    let synopsis = $("p.sinopsis").text().clearSpaces();
  $("p.genres").find("span").each((i,e)=> {
    categories.push($(e).text().clearSpaces());
  });
  $("ul.episodes-list").find("a").each((i,e)=> {
    let a = $(e);
    let _title = a.find("div").find("p").text().replace(title,"").clearSpaces();
    episodes.push({title:_title,url: a.attr("href").encode()});
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
    let title = $('.anime-title').text().clearSpaces();
    let episodes = undefined
    $(".episodes-nav").first().find("a").each((i, e) => {
        let text = $(e).text().clearSpaces();
        switch (text) {
            case "Episodio anterior": previous = $(e).attr("href").encode(); break;
            case "Listado de episodios": episodes = $(e).attr("href").encode(); break;
            case "Episodio siguiente": next = $(e).attr("href").encode(); break;
        }
    });
    $("#chapter_imgs").find("img").each((index, element) => {
        let url = $(element).attr('src');
        if(url!=="/discord.jpg")
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