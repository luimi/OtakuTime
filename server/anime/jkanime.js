const cheerio = require('cheerio');
const root = "https://jkanime.net"
const main = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('#animes').find('a').each((index, element) => {
        let a = $(element)
        let url = a.attr('href').encode()
        let title_group = a.find('.anime__sidebar__comment__item__text')
        let title = a.find('.strlimit.card-title').text()
        let chapter = a.find('.badge.badge-primary').text().replace("Ep", "").clearSpaces()
        let poster = a.find('img').attr('src')
        result.push({ title, url, poster, chapter })
    });
    return result;
};
const search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.anime__item').each((index, element) => {
        let a = $(element).find('a')

        let url = a.attr('href').encode()
        let title = $(element).find('.anime__item__text').find('a').text()
        let poster = $(element).find('.anime__item__pic').attr('data-setbg')
        result.push({ title, url, poster })
    });
    return result;
};
const episodes = async (html) => {
    let $ = cheerio.load(html)

    const token = $('meta[name="csrf-token"]').attr("content") || "";
    const animeId = $('[data-anime]').first().attr("data-anime") || "";
    const animeUrl = $('meta[property="og:url"]').attr("content") || "";

    const result = {
        title: $("h3").first().text().trim(),
        poster: $('meta[property="og:image"]').attr("content") || "",
        synopsis: $(".anime_info p.scroll").text().trim(),
        episodes: [],
        categories: [],
        extras: []
    };

    // Categorías (Géneros)
    $('.anime_data li').each((_, el) => {
        const label = $(el).find("span").first().text().trim().replace(":", "");

        if (/generos/i.test(label)) {
            $(el)
                .find("a")
                .each((_, a) => {
                    const genre = $(a).text().trim();
                    if (genre && !result.categories.includes(genre)) {
                        result.categories.push(genre);
                    }
                });
        }
    });

    // Extras
    const added = new Set();

    $(".anime_data li").each((_, el) => {
        const span = $(el).find("span").first();

        if (!span.length) return;

        const title = span
            .text()
            .replace(":", "")
            .trim();

        let content = span
            .parent()
            .clone()
            .find("span")
            .remove()
            .end()
            .text()
            .replace(/\s+/g, " ")
            .trim();

        if (!content) {
            content = $(el).find("div").text().trim();
        }

        if (
            title &&
            content &&
            !/^generos$/i.test(title) &&
            !added.has(title.toLowerCase())
        ) {
            added.add(title.toLowerCase());

            result.extras.push({
                title,
                content
            });
        }
    });

    // Obtener cantidad de episodios
    try {
        const response = await fetch(
            `https://jkanime.net/ajax/episodes/${animeId}/1`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "sec-fetch-site": "same-origin"
                },
                body: `_token=${encodeURIComponent(token)}`
            }
        );

        const { total } = await response.json();

        for (let episode = total; episode >= 1; episode--) {
            result.episodes.push({
                title: String(episode),
                url: `${animeUrl}${episode}`.encode()
            });
        }
    } catch (err) {
        console.error("Error obteniendo episodios:", err);
    }

    return result;

};
const episode = (html) => {
    let $ = cheerio.load(html)

    const result = {
        poster: null,
        title: "",
        links: [],
        streams: [],
        next: null,
        previous: null,
        episodes: null,
        chapter: "",
    };

    // -----------------------
    // Título y capítulo
    // -----------------------
    const title = $("h1").first().text().trim();

    if (title) {
        result.title = title.replace(/^Episodio\s+\d+\s*-\s*/i, "").trim();

        const chapter = title.match(/Episodio\s+([0-9.]+)/i);
        if (chapter)
            result.chapter = chapter[1];
    }

    // -----------------------
    // Poster
    // -----------------------
    result.poster =
        $('meta[property="og:image"]').attr("content") ||
        $(".video_t img").first().attr("src") ||
        null;

    // -----------------------
    // Navegación
    // -----------------------
    $(".anime_slug a").each((_, el) => {
        const href = $(el).attr("href");
        const text = $(el).text().trim().toLowerCase();

        if (text.includes("anterior"))
            result.previous = href.encode();

        else if (text.includes("siguiente"))
            result.next = href.encode();

        else if (text.includes("episodios"))
            result.episodes = href.encode();
    });

    // -----------------------
    // Buscar arreglo servers[]
    // -----------------------
    let servers = [];

    $("script").each((_, script) => {
        const code = $(script).html();

        if (!code) return;

        const match = code.match(
            /var\s+servers\s*=\s*(\[[\s\S]*?\]);/
        );

        if (!match) return;

        try {
            servers = JSON.parse(match[1]);
        } catch (e) { }
    });

    // -----------------------
    // Clasificar enlaces
    // -----------------------
    servers.forEach(server => {
        if (!server.remote) return;

        let url;

        try {
            url = Buffer.from(server.remote, "base64")
                .toString("utf8")
                .trim();
        } catch {
            return;
        }

        const name = (server.server || "").toLowerCase();

        const downloadServers = [
            "mediafire",
            "mega"
        ];

        if (downloadServers.includes(name))
            result.links.push(url);
        else
            result.streams.push(url);
    });

    return result;
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