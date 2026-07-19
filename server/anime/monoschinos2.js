const cheerio = require("cheerio");
const root = "https://monoschinos.st";
const main = (html) => {
  let result = [];
  let $ = cheerio.load(html);
  $("section").each((_, section) => {
    const title = $(section).find("h2").first().text().trim();
    if (title !== "Últimos capítulos") return;
    $(section).find("article").each((_, article) => {
      const link = $(article).find("a.card-wrap").first();
      const url = link.attr("href").encode() || "";
      const poster = link.find("img.card-img").attr("data-src") || "";
      const animeTitle = link.find("h3.card-title").text().trim();
      const chapter = link
        .find("div")
        .filter((_, el) => {
          return /^EP\s*\d+/i.test($(el).text().trim());
        })
        .first()
        .text()
        .trim()
        .replace(/^EP\s*/i, "");
      result.push({
        title: animeTitle,
        url,
        poster,
        chapter
      });
    });
  });
  return result;
};
const search = (html) => {
  let result = [];
  let $ = cheerio.load(html);
  $("article").each((_, article) => {
    const card = $(article).find("a.card-wrap").first();

    if (!card.length) return;

    const title =
      card.find(".card-title").first().text().trim() ||
      card.attr("title") ||
      "";

    const url = card.attr("href").encode() || "";

    const poster =
      card.find("img").attr("data-src") ||
      "";

    result.push({
      title,
      url,
      poster
    });
  });
  return result;
};
const episodes = async (html) => {
  let $ = cheerio.load(html);
  let result = {
    title: "",
    poster: "",
    synopsis: "",
    episodes: [],
    categories: [],
    extras: []
  };
  result.title = $("h1").first().text().trim();
  result.poster =
    $("img[data-src]").first().attr("data-src") ||
    $("img").first().attr("src") ||
    "";
  result.synopsis = $("p")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();

  // -----------------------------
  // Categorías (si existen)
  // -----------------------------

  $(".genres a, .genre a, .tags a, .categories a").each((_, el) => {
    const name = $(el).text().trim();

    if (name)
      result.categories.push(name);
  });

  // -----------------------------
  // Extras
  // -----------------------------

  $("#tab-info dl dt").each((_, dt) => {

    const title = $(dt)
      .text()
      .trim();

    const content = $(dt)
      .next("dd")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    if (title && content) {

      result.extras.push({
        title,
        content
      });

    }

  });

  // -----------------------------
  // Episodios
  // -----------------------------

  const ajaxUrl = $(".caplist").attr("data-ajax");

  if (ajaxUrl) {

    const pagination = await fetch(ajaxUrl).then(r => r.json());

    const totalEpisodes = pagination.eps.length;
    const perPage = pagination.perpage;

    const totalPages = Math.ceil(totalEpisodes / perPage);

    for (let page = 1; page <= totalPages; page++) {

      const data = await fetch(
        `${pagination.paginate_url}?p=${page}`
      ).then(r => r.json());

      for (const ep of data.caps) {

        result.episodes.push({
          title: String(ep.episodio),
          url: ep.url.encode()
        });

      }

    }

    // ordenar por número
    result.episodes.sort((a, b) => Number(a.title) - Number(b.title));
    result.episodes = result.episodes.toReversed()
  }

  return result;
};
const episode = (html) => {
  let $ = cheerio.load(html);
  const result = {
    poster: null,
    title: "",
    links: [],
    streams: [],
    next: null,
    previous: null,
    episodes: null,
    chapter: null,
  };

  // Poster (opcional)
  result.poster =
    $('meta[property="og:image"]').attr("content") ||
    null;

  // Título
  result.title =
    $("h2").first().text().trim() ||
    $('meta[property="og:title"]')
      .attr("content")
      ?.replace(/ Episodio.*$/i, "")
      .replace(/ Sub Español.*$/i, "")
      .trim() ||
    "";

  // Capítulo
  result.chapter =
    $(".text-brand")
      .filter((_, el) =>
        /Cap[ií]tulo/i.test($(el).text())
      )
      .first()
      .text()
      .replace(/Cap[ií]tulo/i, "")
      .trim() ||
    $("h1")
      .text()
      .match(/episodio\s+(\d+)/i)?.[1] ||
    null;

  // =====================
  // Streams
  // =====================

  $(".play-video").each((_, el) => {
    const encoded = $(el).attr("data-player");
    if (!encoded) return;

    try {
      const url = Buffer.from(encoded, "base64").toString("utf8");
      result.streams.push(url);
    } catch { }
  });

  // quitar duplicados
  result.streams = [...new Set(result.streams)];


  // =====================
  // Links de descarga
  // =====================

  $("a.direct-link").each((_, el) => {
    const url = $(el).attr("href");
    if (url) result.links.push(url);
  });

  result.links = [...new Set(result.links)];


  // =====================
  // Navegación
  // =====================

  $("a").each((_, el) => {
    const text = $(el).text().trim().toLowerCase();

    if (text.includes("anterior")) {
      result.previous = $(el).attr("href").encode() || null;
    }

    if (text.includes("siguiente")) {
      result.next = $(el).attr("href").encode() || null;
    }

    if (
      text.includes("lista de capítulos") ||
      text.includes("lista de capitulos")
    ) {
      result.episodes = $(el).attr("href").encode() || null;
    }
  });
  return result;
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
