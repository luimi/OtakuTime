const cheerio = require("cheerio");
const axios = require("axios");
const root = "https://yugenmangas.com";
var FormData = require("form-data");

const main = (html) => {
  let result = [];
  let $ = cheerio.load(html);
  $(".site-content")
    .find(".series")
    .each((index, element) => {
      let a = $(element).find("a");
      let url = a.attr("href");
      let e = $(element);
      let title = e.parent().find("h5").text();
      let poster = a.find("img").attr("src");
      result.push({ title, url, poster });
    });
  return result;
};
const search = async (html) => {
  let result = [];
  let $ = cheerio.load(html);
  $(".c-tabs-item")
    .find(".c-tabs-item__content")
    .each((index, element) => {
      let a = $(element).find(".tab-thumb").find("a");
      let url = a.attr("href");
      let e = $(element);
      let title = e.find(".tab-summary").find("h3").text();
      let poster = a.find("img").attr("data-src");
      result.push({ title, url, poster });
    });
  return result;
};
const episodes = async (html) => {
  let episodes = [];
  let categories = [];
  let extras = [];
  let $ = cheerio.load(html);
  let poster = undefined;
  let title = $(".post-title").find("h1").text().trim();
  let synopsis = $(".summary__content").find("p").text();
  let currentUrl = "";
  $("meta").each((index, element) => {
    let e = $(element);
    if (e.attr("property") === "og:image") {
      poster = e.attr("content");
    }
    if (e.attr("property") === "og:url") {
      currentUrl = e.attr("content");
    }
  });
  $(".summary_content")
    .find(".post-content")
    .find(".post-content_item")
    .each((index, element) => {
      let e = $(element);
      let _title = e.find(".summary-heading").text().trim();
      let content = e.find(".summary-content").text().replace(title, "").trim();
      if (_title === "Genero(s)") {
        let list = content.split(",");
        list.forEach((text) => {
          categories.push(text.trim());
        });
      } else {
        extras.push({
          title: _title,
          content: content,
        });
      }
    });
  $(".summary_content")
    .find(".post-status")
    .find(".post-content_item")
    .each((index, element) => {
      let e = $(element);
      let title = e.find(".summary-heading").text().trim();
      let content = e.find(".summary-content").text().trim();
      extras.push({
        title: title,
        content: content,
      });
    });
  var config = {
    method: "post",
    url: `${currentUrl}ajax/chapters/`,
  };
  try {
    let response = await axios(config);
    $ = cheerio.load(response.data);
    $(".version-chap")
      .find("a")
      .each((index, element) => {
        let a = $(element);
        episodes.push({
          title: a.find(".chapter-manhwa-title").text(),
          url: a.attr("href"),
        });
      });
  } catch (e) {}
  return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
  let pages = [];
  let next = undefined;
  let previous = undefined;
  let $ = cheerio.load(html);
  let title = $("#chapter-heading").text();
  let episodes = undefined;
  $(".breadcrumb:first")
    .find("li")
    .each((index, element) => {
      if (index === 1) {
        let a = $(element).find("a");
        episodes = a.attr("href");
      }
    });
  $(".reading-content")
    .find("img")
    .each((index, element) => {
      let e = $(element);
      pages.push(e.attr("data-src").trim());
    });
  let nav = $(".select-pagination");
  previous = nav.find(".nav-previous").find("a").attr("href");
  next = nav.find(".nav-next").find("a").attr("href");
  return { title, pages, next, previous, episodes };
};

module.exports = {
  mainUrl: root,
  searchUrl: (text) => {
    return `${root}/?s=${text}&post_type=wp-manga`;
  },
  main: main,
  search: search,
  episodes: episodes,
  episode: episode,
};
