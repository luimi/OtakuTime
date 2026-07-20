const cheerio = require('cheerio');
const root = "https://animemovil2.com";
/*

  __  __       _       
 |  \/  |     (_)      
 | \  / | __ _ _ _ __  
 | |\/| |/ _` | | '_ \ 
 | |  | | (_| | | | | |
 |_|  |_|\__,_|_|_| |_|
                       
                       
{title,url,poster,chapter}
*/
const main = (html) => {
    let $ = cheerio.load(html);

    let result = [];
    $('h2:contains("Episodios")').closest('section').find('article.group\\/item').each((index, element) => {
        const item = $(element);

        // Extracción del título: se obtiene del atributo 'alt' de la imagen o del header interno
        const title = item.find('img').attr('alt') || item.find('header .text-2xs').text().trim();

        // Extracción de la URL: se obtiene del enlace principal que envuelve el artículo
        const url = (root + item.find('a.absolute').attr('href')).encode() || '';

        // Extracción del póster/imagen miniatura
        const poster = item.find('img').attr('src') || '';

        // Extracción del número de capítulo (por ejemplo: "3", "16", etc.)
        const chapter = item.find('.rounded.bg-line span.font-bold.text-lead').text().trim();

        // Agregamos al array cumpliendo el modelo exacto esperado
        result.push({
            title: title,
            url: url,
            poster: poster,
            chapter: chapter
        });
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
    $('.grid-animes li').each((index, element) => {
        const item = $(element);
        const title = item.find('article a > p').text().trim();
        const url = (root + item.find('article a').attr('href')).encode() || '';
        const poster = item.find('article .main-img img').attr('src') || '';
        result.push({
            title: title,
            url: url,
            poster: poster
        });
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

    const title = $('h1.line-clamp-2').text().trim();

    // 2. Extracción del Póster (Meta propiedad og:image o imagen de portada)
    const poster = $('meta[property="og:image"]').attr('content') || $('#anime_image').attr('src') || '';

    // 3. Extracción de la Sinopsis (Contenido dentro de la clase .entry)
    const synopsis = $('.entry p').text().trim();

    // 4. Extracción de las Categorías (Géneros)
    const categories = [];
    $('.flex.flex-wrap.items-center.gap-2 a[href*="genero="]').each((index, element) => {
        categories.push($(element).text().trim());
    });

    // 5. Extracción de Extras (Tipo, vistas, estado, etc.)
    const extras = [];

    // Tipo de anime extraído de la cabecera (Ej: TV Anime)
    const typeText = $('.flex.flex-wrap.items-center.gap-2.text-sm span').first().text().trim();
    if (typeText) {
        extras.push({ title: 'Tipo', content: typeText });
    }

    // Estado e Información adicional desde el bloque de texto útil
    const infoSpans = $('.flex.flex-wrap.items-center.gap-2.text-sm span');
    infoSpans.each((index, element) => {
        const text = $(element).text().trim();
        if (text.includes('vistas')) {
            extras.push({ title: 'Vistas', content: text.replace('vistas', '').trim() });
        } else if (text === 'En emision' || text === 'Finalizado') {
            extras.push({ title: 'Estado', content: text });
        }
    });

    // 6. Extracción del ID del Anime (desde la etiqueta meta og:url)
    const animeId = $('meta[property="og:url"]').attr('content') || '';

    // 7. Extracción y cálculo del último episodio desde la paginación (.episode-navigation)
    let lastEpisodeNum = 0;
    $('.episode-navigation button.episode-btn').each((index, element) => {
        const buttonText = $(element).text().trim(); // Ej: "17 - 20"
        if (buttonText.includes('-')) {
            const parts = buttonText.split('-');
            const highNum = parseInt(parts[1].trim(), 10);
            if (highNum > lastEpisodeNum) {
                lastEpisodeNum = highNum;
            }
        }
    });

    // 8. Construcción del listado de episodios en orden descendente (mayor a menor)
    const episodes = [];
    for (let i = lastEpisodeNum; i >= 1; i--) {
        episodes.push({
            title: `${i}`,
            url: `${root}/ver/${animeId}-${i}`.encode()
        });
    }
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
{title,links:[string],strams:[string],next,previous,episodes,chapter}
*/
const episode = (html) => {
    let $ = cheerio.load(html)

    let title = $('h1.text-2xl').first().text().trim() || "";

    // 2. Extraer Póster (Opcional, buscamos en las etiquetas Open Graph de imagen)
    const poster = $('meta[property="og:image"]').first().attr('content') || "";

    // 3. Extraer Streams (Buscamos dentro del bloque de texto de la variable tabsArray)
    const streams = [];
    $('script').each((i, el) => {
        const scriptContent = $(el).html();
        if (scriptContent && scriptContent.includes('tabsArray')) {
            // Expresión regular para capturar la URL interna del parámetro 'id=' o el src directo si cambia
            const regex = /tabsArray\['\d+'\]\s*=\s*["']<iframe.*?src=['"](.*?)['"]/g;
            let match;
            while ((match = regex.exec(scriptContent)) !== null) {
                const iframeUrl = match[1];
                try {
                    // Intentamos extraer el valor del parámetro "id" de la URL del iframe
                    const urlObj = new URL(iframeUrl);
                    const streamUrl = urlObj.searchParams.get('id');
                    if (streamUrl) {
                        streams.push(streamUrl);
                    } else {
                        // Si no viene como parámetro, guardamos la URL tal cual
                        streams.push(iframeUrl);
                    }
                } catch (e) {
                    // En caso de que falle el parseo de la URL, guardamos el texto original capturado
                    streams.push(iframeUrl);
                }
            }
        }
    });

    // 4. Extraer Links de Descarga (Buscamos los enlaces 'a' que le siguen al h1 de Descargas)
    const links = [];
    // Buscamos el h1 que contiene la palabra Descargas
    const downloadHeader = $('h1').filter((i, el) => $(el).text().includes('Descargas'));

    if (downloadHeader.length > 0) {
        // Buscamos el contenedor de enlaces adyacente o cercano
        downloadHeader.parent().find('a[href]').each((i, el) => {
            let downloadUrl = $(el).attr('href');
            // Limpiamos si viene envuelto en un redireccionador tipo smart.php?url=...
            if (downloadUrl.includes('smart.php?url=')) {
                try {
                    const urlObj = new URL(downloadUrl);
                    downloadUrl = urlObj.searchParams.get('url') || downloadUrl;
                } catch (e) { }
            }
            links.push(downloadUrl);
        });
    }

    // 5. Extraer Links de Navegación (Anterior, Siguiente, Episodios)
    const previous = (root + $('a[aria-label="Anterior"]').attr('href')).encode() || "";
    const next = (root + $('a[aria-label="Siguiente"]').attr('href')).encode() || "";
    const episodes = (root + $('a[aria-label="Episodios"]').attr('href')).encode() || "";

    // 6. Extraer Capítulo y Saga/Nombre extra (Opcional, parseando el h1 o title si se requiere)
    // Usamos una regex simple para identificar el número de episodio en el título
    const chapterMatch = title.match(/Episodio\s+(\d+)/i) || title.match(/episodio\s+(\d+)/i);
    const chapter = chapterMatch ? chapterMatch[1] : "";
    title = title.replace(/Episodio\s+(\d+)/i, "").trim()
    return { title, links, streams, next, previous, episodes, chapter };
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/directorio/anime?q=${text}`;
    },
    main: main,
    search: search,
    episodes: episodes,
    episode: episode
}