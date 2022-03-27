const cheerio = require("cheerio");
const root = "https://monoschinos2.com";
const main = (html) => {
  let result = [];
  let $ = cheerio.load(html);
  $(".heroarea1")
    .find("a")
    .each((index, element) => {
      let a = $(element);
      let url = a.attr("href");
      let title = `${a.find("p").text()} - ${a.find('.positioning').find('h5').text()}`
      let poster = a.find("img").attr("data-src");
      if(url && title && poster)
        result.push({ title, url, poster });
    });
  return result;
};
const search = (html) => {
  let result = [];
  let $ = cheerio.load(html);
  $(".heromain")
    .find("a")
    .each((index, element) => {
      let a = $(element);
      let url = a.attr("href");
      let title = $(element).find(".seristitles").text();
      let poster = $(element).find("img").attr("src");
      result.push({ title, url, poster });
    });
  return result;
};
const episodes = (html) => {
  let episodes = [];
  let categories = [];
  let extras = [];
  let $ = cheerio.load(html);
  let poster = $(".herobg").find("img").attr("src");
  let title = $(".mobh1").text();
  $(".textComplete").find("a").remove();
  let synopsis = $(".textComplete").text();
  $("ol.breadcrumb:first")
    .find("li")
    .each((index, element) => {
      categories.push($(element).text());
    });
  categories.shift();
  $(".col-item").each((index, element) => {
    let a = $(element).find("a");
    episodes.push({ title: a.find("p").text(), url: a.attr("href") });
  });
  episodes = episodes.reverse();
  return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
  let links = [];
  let streams = [];
  let next = undefined;
  let previous = undefined;
  let poster = undefined;
  let $ = cheerio.load(html);
  let title = $(".heromain_h1").text();
  let episodes = undefined;
  $("meta").each((index, element) => {
    let e = $(element);
    if (e.attr("property") === "og:image") {
      poster = e.attr("content");
    }
  });
  $(".downbtns").find('a').each((index, element) => {
    let url = $(element).attr("href");
    links.push(url);
  });

  $(".playother").find('p').each((index, element) => {
    let e = $(element);
    let buff = Buffer.from(e.attr('data-player'), 'base64');
    let url = buff.toString('ascii');
    url = url.replace("https://monoschinos2.com/reproductor?url=","")
    streams.push(url);
  });
  $(".controldiv2").find('a').each((index,element) => {
    let a = $(element)
    if(a.find('img').attr('src').includes('playarrowleft')){
      previous = a.attr('href')
    } else if(a.find('img').attr('src').includes('playarrowright')){
      next = a.attr('href')
    } else if(a.find('img').attr('src').includes('playlist')){
      episodes = a.attr('href')
    }
  });
  return { title, poster, links, streams, next, previous, episodes};
};

module.exports = {
  mainUrl: root,
  searchUrl: (text) => {
    return `${root}/buscar?q=${text}`;
  },
  main: main,
  search: search,
  episodes: episodes,
  episode: episode,
};
