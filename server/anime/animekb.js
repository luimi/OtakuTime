const cheerio = require('cheerio')
const root = "http://animekb.net"
const main_search = (html) => {
    let result = []
    let $ = cheerio.load(html)
    $('.post-thumbnail').each((index, element) => {
        let a = $(element).find('a')
        let url = a.attr('href').encode()
        let title = a.attr('title')
        let poster = a.find('.figure-img').find('img').attr('src')
        result.push({ title, url, poster })
    });
    return result;
};
const episodes = (html) => {
    let episodes = []
    let categories = []
    let extras = []
    let $ = cheerio.load(html)
    let poster = $('.imgthumb').find('img').attr('src')
    let title = $('.entry-title').text().clearSpaces()
    let synopsis = $('.content-squ').find('p').text()
    
    $('#sidebar').find('div').each((index, element) => {
        let e = $(element)
        switch (index) {
            case 1:
                let status = e.text().toLowerCase().split(":");
                extras.push({ title: status[0].clearSpaces(), content: status[1].clearSpaces() });
                break;
            case 2:
                let texts = e.find('.textwidget').text().split("\n")
                texts.forEach(val => {
                    if (val.clearSpaces() !== "") {
                        let splitted = val.split(":");
                        try{
                            extras.push({ title: splitted[0].clearSpaces(), content: splitted[1].clearSpaces() });
                        }catch(e){}
                    }
                });
                break;
        }
    });
    $('.content-squ').find('ul').find('li').each((index, element) => {
        categories.push($(element).find('a').text());
    });
    $('.lcclink').each((index, element) => {
        let url = element.attribs.href.encode()
        let _title = element.children[0].children[0].data.replace(title,"").clearSpaces();
        episodes.push({ title:_title, url })
    });
    return { poster, title, synopsis, categories, extras, episodes };
};
const episode = (html) => {
    let links = []
    let $ = cheerio.load(html)
    let poster = $('.separator').find('img').attr('src');
    let title = $('.entry-title').text().clearSpaces();
    let episodes = undefined
    $('body').find('link').each((index,element) => {
      let e = $(element)
      if(e.attr('rel') === "canonical"){
        let splitedName = e.attr('href').split('/')[3].split('-')
        let name = splitedName[0]
        for (let i = 1 ; i < splitedName.length-1; i++){
          name+= `-${splitedName[i]}`
        }
        episodes = `${root}/anime/${name}`.encode()
      }
    })
    $(".botondescarga").each((index, element) => {
        let url = element.parent.attribs.href
        links.push(url);
    });
    links.splice(links.length - 1, 1);
    return { poster, title, links, episodes};
};

module.exports = {
    mainUrl: root,
    searchUrl: (text) => {
        return `${root}/buscar/?p=${text}&genero=all&letter=all`;
    },
    main: main_search,
    search: main_search,
    episodes: episodes,
    episode: episode
}