const cheerio = require('cheerio');
const axios = require('axios');
const root = "https://inmanga.com"
const main = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.list-group-item').each((index, element) => {
        let a = $(element)
        let url = `${root}${a.attr('href')}`.encode()
        let title = a.find('.text-primary').text().clearSpaces()
        let chapter = a.find('.recent-chapter-container-footer').find('strong').text().clearSpaces().split(" ").pop()
        let poster = a.find('img').attr('src')
        result.push({ title, url, poster, chapter })
    });
    return result;
};
const search = async (html) => {
    let result = []
    try {
        let response = await axios.get(`https://inmanga.com/manga/GetQuickSearch?name=${html.query}`);
        let data = JSON.parse(response.data.data);
        data.result.forEach(item => {
            result.push({ title: item.Name, url: `${root}/ver/manga/${item.Name.replace(/\s/g, "-")}/${item.Identification}`.encode(), poster: item.ThumbnailPath })
        });
    } catch (e) {
        return { success: false, error: e }
    }
    return result;
};
const episodes = async (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let posterPath = $('.text-center').find('img').attr('src')
    let poster = `${root}${posterPath}`
    let texts = $('.manga-index-sinopsis-detail-cover-photo-layout')
    let title = texts.find('.panel-heading').text().clearSpaces()
    let synopsis = texts.find('.panel-body').text().clearSpaces()
    $('.list-group-item').each((index, element) => {
        let a = $(element)
        let texts = a.text().clearSpaces().replace(/\s+/g, ":").split(":")
        if (texts.length == 2)
            extras.push({ title: texts[1], content: texts[0] });
    });
    let mangaId = $('#Identification').attr('value');
    let posterSegments = posterPath.split("/");
    try {
        let response = await axios.get(`https://inmanga.com/chapter/getall?mangaIdentification=${mangaId}`)
        let data = JSON.parse(response.data.data);
        data.result.sort((a, b) => { return a.Number < b.Number ? 1 : -1 })
        data.result.forEach((manga) => {
            episodes.push({ title: manga.Number, url: `${root}/ver/manga/${posterSegments[3]}/${manga.Number}/${manga.Identification}`.encode() })
        });
    } catch (e) { }
    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = async (html) => {
    let pages = []
    let next = undefined
    let previous = undefined
    let $ = cheerio.load(html)
    let name = $('.ChapterDescriptionContainer').find('h1').text().clearSpaces();
    let chapter = name.split(" ").pop()
    let title = name.replace(` Capítulo ${chapter}`,"").trim()
    let episodes = undefined
    let pathSegmented = undefined
    $("meta").each((index, element) => {
        let e = $(element)
        if (e.attr('property') === 'og:url') {
            pathSegmented = e.attr('content').split("/")
        }
    });
    try {
        let response = await axios.get(`https://inmanga.com/chapter/chapterIndexControls?identification=${pathSegmented[7]}`)
        $ = cheerio.load(response.data)
        $(".ImageContainer").each((index, element) => {
            let e = $(element)
            pages.push(`https://pack-yak.intomanga.com/images/manga/${pathSegmented[5]}/chapter/${pathSegmented[6]}/page/${e.attr('data-pagenumber')}/${e.attr('id')}`)
        });
        episodes = `${root}${$('.list-group-item').attr('href')}`.encode();
        $('#ChapList').find('option').each((index, element) => {
            let e = $(element)
            if (parseInt(e.text().clearSpaces()) === parseInt(pathSegmented[6]) - 1) {
                previous = `${root}/ver/manga/${pathSegmented[5]}/${e.text().clearSpaces()}/${e.attr('value')}`.encode()
            }
            if (parseInt(e.text().clearSpaces()) === parseInt(pathSegmented[6]) + 1) {
                next = `${root}/ver/manga/${pathSegmented[5]}/${e.text().clearSpaces()}/${e.attr('value')}`.encode()
            }
        })
    } catch (e) { }

    return { title, pages, next, previous, episodes, chapter };
};

module.exports = {
    mainUrl: `${root}/chapter/getRecentChapters`,
    searchUrl: (text) => {
        return `${process.env.SERVER}/transfer?text=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}