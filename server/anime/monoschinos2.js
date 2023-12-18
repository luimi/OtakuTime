const cheerio = require("cheerio");
const root = "https://monoschinos2.com";
const main = (html) => {
  let result = [];
  let $ = cheerio.load(html);
  $(".heroarea1")
    .find("a")
    .each((index, element) => {
      let a = $(element);
      let url = a.attr("href").encode();
      let title = a.find('.animetitles').text()
      let chapter = a.find("p").text()
      let poster = a.find("img").attr("data-src");
      if(url && title && poster)
        result.push({ title, url, poster, chapter });
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
      let url = a.attr("href").encode();
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
    episodes.push({ title: a.find("p").text().replace("Capitulo","").trim(), url: a.attr("href").encode() });
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
  let name = $(".heromain_h1").text().trim();
  let chapter = name.split(" ").pop();
  let title = name.replace("Ver","").replace(`- ${chapter}`,"").trim();
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
  $(".controles").find('a').each((index,element) => {
    let a = $(element)
    if(a.text().includes('Anterior')){
      previous = a.attr('href').encode()
    } else if(a.text().includes('Siguiente')){
      next = a.attr('href').encode()
    } else if(a.text().includes('Lista')){
      episodes = a.attr('href').encode()
    }
  });
  return { title, poster, links, streams, next, previous, episodes, chapter};
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
