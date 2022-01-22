const express = require('express')
const app = express()
const axios = require('axios')
const animekb = require('./anime/animekb')
const animeid = require('./anime/animeid')
const jkanime = require('./anime/jkanime')
const hitokin = require('./anime/hitokin')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    //res.header("Access-Control-Allow-Origin", "https://otakutime.netlify.app");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
servers = {
    animekb,
    animeid,
    jkanime,
    hitokin
}

app.get('/', async (req, res) => {
    res.json({ success: true });
});
app.post('/anime', async (req, res) => {
    let body = req.body;
    if (body && body.server && body.action) {
        let server = servers[req.body.server];
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
app.get('/anime', async (req, res) => {
    res.json({
        success: true, data: [
            { name: 'AnimeKB', server: 'animekb', logo: 'https://i.imgur.com/ptPVBLU.png' },
            { name: 'AnimeID', server: 'animeid', logo: 'https://static.animeid.tv/img/logo.png' },
            { name: 'JKAnime', server: 'jkanime', logo: 'https://cdn.jkanime.net/assets2/css/img/logo.png' },
            { name: 'Hitokin', server: 'hitokin', logo: 'https://cdn.jkanime.net/assets2/css/img/logo.png' },
        ]
    })
});
const _axios = (url) => {
    return new Promise((res, rej) => {
        axios.get(url).then((response) => {
            let html = response.data;
            res(html);
        }).catch(e => {
            rej(e.message);
        });
    });

}

app.listen(process.env.PORT, () => {
    console.log("OtakuTime server ready");
});
