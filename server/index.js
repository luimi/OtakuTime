const express = require("express");
const app = express();
const fs = require("fs").promises;
const axios = require("axios");
const animekb = require("./anime/animekb");
const animeid = require("./anime/animeid");
const jkanime = require("./anime/jkanime");
const hitokin = require("./anime/hitokin");
const animefenix = require("./anime/animefenix");
const monoschinos2 = require("./anime/monoschinos2");
const lectortmoorg = require("./manga/lectortmoorg");
const mangatemplo = require("./manga/mangatemplo");
const yugenmangas = require("./manga/yugenmangas");
const nartag = require("./manga/nartag");
const inmanga = require("./manga/inmanga");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  //res.header("Access-Control-Allow-Origin", "https://otakutime.netlify.app");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
let servers = {
  animekb,
  animeid,
  jkanime,
  hitokin,
  animefenix,
  monoschinos2,
  lectortmoorg,
  mangatemplo,
  yugenmangas,
  nartag,
  inmanga
};

const _axios = (url) => {
  return new Promise((res, rej) => {
    axios
      .get(url)
      .then((response) => {
        let html = response.data;
        res(html);
      })
      .catch((e) => {
        rej(e.message);
      });
  });
};

app.get("/", async (req, res) => {
  res.json({ success: true });
});
/*

              _                
             (_)               
   __ _ _ __  _ _ __ ___   ___ 
  / _` | '_ \| | '_ ` _ \ / _ \
 | (_| | | | | | | | | | |  __/
  \__,_|_| |_|_|_| |_| |_|\___|
                               
                               

*/

app.get("/anime", async (req, res) => {
  try {
    let animeList = await axios.get("https://api.mocklets.com/p68342/anime")
    res.json({
      success: true,
      data: animeList.data
    });
  } catch (e) {
    res.json({ success: false });
  }

});


/*

                                    
                                    
  _ __ ___   __ _ _ __   __ _  __ _ 
 | '_ ` _ \ / _` | '_ \ / _` |/ _` |
 | | | | | | (_| | | | | (_| | (_| |
 |_| |_| |_|\__,_|_| |_|\__, |\__,_|
                         __/ |      
                        |___/       

*/

app.get("/manga", async (req, res) => {
  try {
    let animeList = await axios.get("https://api.mocklets.com/p68342/manga")
    res.json({
      success: true,
      data: animeList.data
    });
  } catch (e) {
    res.json({ success: false });
  }
});

/*

            _                  _   
           | |                | |  
   _____  _| |_ _ __ __ _  ___| |_ 
  / _ \ \/ / __| '__/ _` |/ __| __|
 |  __/>  <| |_| | | (_| | (__| |_ 
  \___/_/\_\\__|_|  \__,_|\___|\__|
                                   
                                   

*/

app.post("/extract", async (req, res) => {
  let responses = [];
  try {
    let pages = [
      { name: "main", url: req.body.main },
      { name: "search", url: req.body.search },
      { name: "episodes", url: req.body.episodes },
      { name: "episode", url: req.body.episode },
    ];
    for (let i = 0; i < pages.length; i++) {
      let response = await _axios(pages[i].url);
      if (response) {
        await fs.writeFile(`test/${pages[i].name}.html`, response);
        responses.push(`${pages[i].name} saved`);
      }
    }
    res.json({ success: true, data: responses });
  } catch (e) {
    console.log("error", e)
    res.json({ success: false, error: e, responses });
  }
});

app.get("/extract", async (req, res) => {
  try {
    let html = await fs.readFile(`test/${req.query.action}.html`, "utf8");
    let response = await servers[req.query.server][req.query.action](html);
    res.json({ success: true, data: response });
  } catch (e) {
    res.json({ success: false, error: e });
  }
});
/*

  _                            
 (_)                           
  _ _ __ ___   __ _  __ _  ___ 
 | | '_ ` _ \ / _` |/ _` |/ _ \
 | | | | | | | (_| | (_| |  __/
 |_|_| |_| |_|\__,_|\__, |\___|
                     __/ |     
                    |___/      

*/
app.get("/image", async (req, res) => {
  let noImage =
    "https://www.segelectrica.com.co/wp-content/themes/consultix/images/no-image-found-360x250.png";
  let url = req.query.url ? req.query.url : noImage;
  try {
    axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        res.send(Buffer.from(response.data, "binary"));
      });
  } catch (e) {
    res.send(e);
  }
});
/*


                               
                               
  ___  ___ _ ____   _____ _ __ 
 / __|/ _ \ '__\ \ / / _ \ '__|
 \__ \  __/ |   \ V /  __/ |   
 |___/\___|_|    \_/ \___|_|   
                               
                               


*/

app.post("/", async (req, res) => {
  let body = req.body;
  if (body && body.server && body.action) {
    let server = servers[body.server];
    let url = "";
    switch (body.action) {
      case "main":
        url = server.mainUrl;
        break;
      case "search":
        url = server.searchUrl(body.query);
        break;
      case "episodes":
      case "episode":
        url = body.url;
        break;
    }
    try {
      let html = await _axios(url);
      let response = await server[body.action](html);
      res.json({ success: true, data: response });
    } catch (e) {
      res.json({ success: false, error: e });
    }
  } else {
    res.json({ success: false });
  }
});
app.get("/transfer", async (req, res) => {
  res.json({ query: req.query.text })
});
app.listen(process.env.PORT, () => {
  console.log("OtakuTime server ready");
});
