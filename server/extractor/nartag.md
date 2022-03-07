
                           
                           
   ___ _ __ _ __ ___  _ __ 
  / _ \ '__| '__/ _ \| '__|
 |  __/ |  | | | (_) | |   
  \___|_|  |_|  \___/|_|   
                           
                           
Cloudflare error 403

http://[2606:4700:3034::ac43:8f12]
172.67.143.18:443

headers
//:authority: nartag.com
//:method: GET
//:path: /
//:scheme: https
accept: */*
accept-encoding: gzip, deflate, br
accept-language: es-ES,es;q=0.9
cache-control: no-cache
cookie: _ga=GA1.2.1641378477.1644462030; wpmanga-reading-history=W3siaWQiOjMxLCJjIjoiNTEwMCIsInAiOjEsImkiOiIiLCJ0IjoxNjQ2NTE4MTY2fV0%3D; cf_clearance=oq.EPvo5zSAbOfhMpcWMlc16yQIbnIq2RNPHnf7NmP8-1646695042-0-150; _gid=GA1.2.1902254549.1646695049; _gat_gtag_UA_86991522_4=1; FCNEC=[["AKsRol9SYE7pyfEUhuXovF2utPJ9fD1kwd8tBl6la9ombl8vzJPFie-A7zHkI61l2oWeESVJo9sXlTGJ76_J5e_H0gqPhnbBNwN5Zd_JNXR-MAFOVdHYSkGTKoB1X5tv7ew5bPrAI-jUiIrPfkClcKtJnOVcHgMJIQ=="],null,[]]; __gads=ID=8218b4c9d9950374:T=1644462058:S=ALNI_Ma2-8nHmS4ihIo0GIkXLtEpkru_Pg
pragma: no-cache
referer: https://nartag.com/superpwa-sw.js
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-origin
user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36
  _           _ _    
 | |         | | |   
 | |__  _   _| | | __
 | '_ \| | | | | |/ /
 | |_) | |_| | |   < 
 |_.__/ \__,_|_|_|\_\
                     
                     

main:https://nartag.com/
search:https://nartag.com/?s=la+vida+despues&post_type=wp-manga
episodes:https://nartag.com/bl/la-vida-despues-de-la-muerte/
episode:https://nartag.com/bl/la-vida-despues-de-la-muerte/capitulo-134/

  _            _   
 | |          | |  
 | |_ ___  ___| |_ 
 | __/ _ \/ __| __|
 | ||  __/\__ \ |_ 
  \__\___||___/\__|
                   
                   

https://otakutime.glitch.me/test?server=nartag&action=
main,search,episodes,episode

                          _     
                         | |    
  ___  ___  __ _ _ __ ___| |__  
 / __|/ _ \/ _` | '__/ __| '_ \ 
 \__ \  __/ (_| | | | (__| | | |
 |___/\___|\__,_|_|  \___|_| |_|
                                
                                

let result = [];
  var data = new FormData();
  data.append("action", "wp-manga-search-manga");
  data.append("title", html.query);

  var config = {
    method: "post",
    url: `${root}/wp-admin/admin-ajax.php`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };
  try {
    let response = await axios(config);
    let data = response.data.data;
    data.forEach((anime) => {
      result.push({
        title: anime.title,
        url: anime.url,
        poster: "/assets/no-image.png",
      });
    });
  } catch (e) {}
  return result;

             _               _           
            (_)             | |          
   ___ _ __  _ ___  ___   __| | ___  ___ 
  / _ \ '_ \| / __|/ _ \ / _` |/ _ \/ __|
 |  __/ |_) | \__ \ (_) | (_| |  __/\__ \
  \___| .__/|_|___/\___/ \__,_|\___||___/
      | |                                
      |_|                                
Solicitar URL: https://yugenmangas.com/series/el-gran-mago-retorno-despues-de-4000-anos/ajax/chapters/
Método de solicitud: POST

var config = {
  method: "post",
  url: `${currentUrl}/ajax/chapters/`
};
try {
  let response = await axios(config);
  $ = cheerio.load(response.data);
  $(".version-chap").find('a').each((index, element) => {
    let a = $(element)
    episodes.push({ title: a.find('.chapter-manhwa-title').text(), url: a.attr('href') });
  });
} catch (e) {}