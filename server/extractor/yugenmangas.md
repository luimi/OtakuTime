
  _           _ _    
 | |         | | |   
 | |__  _   _| | | __
 | '_ \| | | | | |/ /
 | |_) | |_| | |   < 
 |_.__/ \__,_|_|_|\_\
                     
                     

main:https://yugenmangas.com/inicio/
search:https://yugenmangas.com/?s=la+vida+despues&post_type=wp-manga
episodes:https://yugenmangas.com/series/el-gran-mago-retorno-despues-de-4000-anos/
episode:https://yugenmangas.com/series/el-gran-mago-retorno-despues-de-4000-anos/capitulo-50/

  _            _   
 | |          | |  
 | |_ ___  ___| |_ 
 | __/ _ \/ __| __|
 | ||  __/\__ \ |_ 
  \__\___||___/\__|
                   
                   

https://otakutime.glitch.me/test?server=yugenmangas&action=
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