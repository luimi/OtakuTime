const cheerio = require("cheerio");
const axios = require("axios");
const root = "https://yugenmangas.com";
var FormData = require("form-data");

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
  $(".series_item__SeriesCard-sc-t4shg7-0").each((i,e)=> {
    let parent = $(e).parent();
    let poster = parent.find(".series_item__SeriesCard-sc-t4shg7-0").find("a").find("img").attr("src");
    let a = parent.find(".series_item__SeriesContent-sc-t4shg7-2").find("a");
    let title = parent.find(".series_item__SeriesTitle-sc-t4shg7-5").text().clearSpaces() + " - "+ a.find(".series_item__Badge-sc-t4shg7-4:first").text();
    let url = (root+a.attr("href")).encode();
    result.push({title,url,poster});
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
const search = async (html) => {
  let result = [];

  try{
    let response = await axios.post("https://api.yugenmangas.com/series/search",{term: html.query});
    response.data.forEach((manga) => {
      let url = `${root}/series/${manga.series_slug}`.encode();
      result.push({title:manga.title, url, poster:"https://www.segelectrica.com.co/wp-content/themes/consultix/images/no-image-found-360x250.png" })
    });
  }catch(e){}
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
const episodes = async (html) => {
  let $ = cheerio.load(html);
  let episodes = [];
  let categories = [];
  let extras = [];
  let poster = $(".series__ThumbImg-sc-v2h5e-0").attr("src");
  let title = $(".series-title").find("h1").text().clearSpaces();
  let synopsis = $(".description-container").text().clearSpaces();
  $(".tags-container").find("span").each((i,e)=> {
    categories.push($(e).text());
  });
  $(".chapters-list-single").find("a").each((i,e) => {
    let a = $(e);
    let url = (root+a.attr("href")).encode();
    let title = a.find(".name").text().clearSpaces();
    episodes.push({title,url})
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
const episode = async (html) => {
  let $ = cheerio.load(html);
  let title = $(".c-dsYLkv").text().clearSpaces();
  let episodes = (root+$(".c-dsYLkv").find("a").attr("href")).encode();
  let previous = (root+$(".prev-chap").find("a").attr("href")).encode();
  let next = (root+$(".next-chap").find("a").attr("href")).encode();
  let pages = [];
  let data = JSON.parse($("#__NEXT_DATA__").text());
  let response = await axios.get("https://api.yugenmangas.com/series/chapter/"+data.props.pageProps.data.id);
  response.data.content.images.forEach((image)=> {
    pages.push("https://api.yugenmangas.com/"+image);
  })
  return {title,episodes,previous,next,pages};
};

module.exports = {
  mainUrl: root,
  searchUrl: (text) => {
    return `${process.env.SERVER}/transfer?text=${text}`;
},
  main: main,
  search: search,
  episodes: episodes,
  episode: episode,
};
