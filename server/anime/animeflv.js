const cheerio = require('cheerio');
const root = "https://www4.animeflv.net";
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
    $('.Title.Page h2').each(function () {
        if ($(this).text().trim() === 'Últimos episodios') {
            // Buscamos el ul de capítulos que está después de este título
            const episodiosList = $(this).closest('.Title.Page').next('ul.ListEpisodios');

            episodiosList.find('li').each((index, element) => {
                const link = $(element).find('a');
                const url = `${root}${link.attr('href')}`.encode();
                const title = link.find('strong.Title').text().trim() + " - " + link.find(".Capi").text().replace("Episodio","").trim();
                const poster = `${root}${link.find('.Image img').attr('src')}`;

                if (title && url) {
                    result.push({
                        title: title,
                        url: url,
                        poster: poster || null
                    });
                }
            });
        }
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
    let $ = cheerio.load(html);

    let result = [];
    $('ul.ListAnimes li article.Anime').each((index, element) => {
        const $article = $(element);
        const $link = $article.find('a');

        // Extraer el título
        const title = $link.find('h3.Title').text().trim();

        // Extraer la URL
        const url = `${root}${$link.attr('href')}`.encode();

        // Extraer el poster (imagen)
        const poster = $link.find('.Image figure img').attr('src');

        // Solo agregar si tenemos título y URL
        if (title && url) {
            result.push({
                title: title,
                url: url,
                poster: poster || null
            });
        }
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
    let $ = cheerio.load(html);
    let result = {};

    let anime = $('meta[property="og:url"]').attr('content').split('/').at(-1);
    // 1. Extraer el título
    const title = $('.Ficha .Title').first().text().trim();
    result.title = title;

    // 2. Extraer el poster
    const poster = $('.AnimeCover .Image figure img').attr('src');
    result.poster = `${root}${poster}`;

    // 3. Extraer los episodios (desde la variable JavaScript 'episodes' en el HTML)
    const episodes = [];
    // Buscar el script que contiene la variable 'episodes'
    const scripts = $('script').toArray();
    let episodesData = null;

    for (const script of scripts) {
        const scriptContent = $(script).html();
        if (scriptContent && scriptContent.includes('var episodes = [')) {
            // Extraer el array de episodios usando regex
            const match = scriptContent.match(/var episodes = (\[[\s\S]*?\]);/);
            if (match) {
                try {
                    // Evaluar el array de episodios (cuidado: solo usar si confías en el origen)
                    episodesData = eval(match[1]);
                    break;
                } catch (e) {
                    console.error('Error al parsear episodios:', e);
                }
            }
        }
    }

    // Convertir los episodios al formato requerido
    if (episodesData && Array.isArray(episodesData)) {
        for (const ep of episodesData) {
            if (Array.isArray(ep) && ep.length >= 2) {
                episodes.push({
                    title: `${ep[0]}`,
                    url: `${root}/ver/${anime}-${ep[0]}`.encode()
                });
            }
        }
    }
    result.episodes = episodes;

    // 4. Extraer las categorías (géneros)
    const categories = [];
    $('.Nvgnrs a').each((index, element) => {
        const category = $(element).text().trim();
        if (category) {
            categories.push(category);
        }
    });
    result.categories = categories;

    // 5. Extraer los extras (animes relacionados)
    const extras = [];
    $('.ListAnmRel li').each((index, element) => {
        const $li = $(element);
        const $link = $li.find('a');
        const titleExtra = $link.text().trim();
        const urlExtra = $link.attr('href');
        // Extraer el tipo de relación (entre paréntesis al final)
        const textContent = $li.text().trim();
        const relationMatch = textContent.match(/\(([^)]+)\)$/);
        const relation = relationMatch ? relationMatch[1] : 'Relacionado';

        if (titleExtra && urlExtra) {
            extras.push({
                title: titleExtra,
                content: relation
            });
        }
    });
    result.extras = extras;
    return result;
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
{poster,title,links:[string],streams:[string],next,previous,episodes}
*/
const episode = (html) => {
    let $ = cheerio.load(html)
    let result = {}
    // 1. Extraer el título del anime
    const title = $('.Brdcrmb strong').text().replace("Episodio","-").trim();
    result.title = title;

    // 2. Extraer el poster (de la imagen en el meta tag og:image)
    let poster = $('meta[property="og:image"]').attr('content');
    if (!poster) {
        poster = $('meta[name="og:image"]').attr('content');
    }
    result.poster = poster;

    // 3. Extraer links de descarga
    const links = [];
    $('.DwsldCn table.Dwnl tbody tr').each((index, element) => {
        const $row = $(element);
        const server = $row.find('td').eq(0).text().trim();
        const format = $row.find('td').eq(2).text().trim();
        const downloadLink = $row.find('td a').attr('href');

        if (downloadLink) {
            links.push(downloadLink);
        }
    });
    result.links = links;

    // 4. Extraer streams (desde la variable JavaScript 'videos')
    const streams = [];
    const scripts = $('script').toArray();
    let videosData = null;

    for (const script of scripts) {
        const scriptContent = $(script).html();
        if (scriptContent && scriptContent.includes('var videos =')) {
            // Extraer el objeto videos usando regex
            const match = scriptContent.match(/var videos = (\{[\s\S]*?\});/);
            if (match) {
                try {
                    videosData = eval('(' + match[1] + ')');
                    break;
                } catch (e) {
                    console.error('Error al parsear videos:', e);
                }
            }
        }
    }

    if (videosData && videosData.SUB) {
        for (const video of videosData.SUB) {
            const streamUrl = video.code || video.url;
            if (streamUrl) {
                streams.push(streamUrl);
            }
        }
    }
    result.streams = streams;

    // 5. Extraer next (siguiente episodio)
    let next = null;
    const nextLink = $('.CapNvNx').attr('href');
    if (nextLink && nextLink !== '#') {
        next = `${root}${nextLink}`.encode();
    }
    result.next = next;

    // 6. Extraer previous (anterior episodio)
    let previous = null;
    const prevLink = $('.CapNvPv').attr('href');
    if (prevLink && prevLink !== '#') {
        previous = `${root}${prevLink}`.encode();
    }
    result.previous = previous;

    // 7. Extraer episodes (lista de episodios desde el script)
    let episodes = null;
    const capLink = $('.CapNvLs').attr('href');
    if (capLink && capLink !== '#') {
        episodes = `${root}${capLink}`.encode();
    }
    
    result.episodes = episodes;
    return result;
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/browse?q=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}