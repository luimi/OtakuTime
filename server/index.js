const express = require('express')
const app = express()
const axios = require('axios')
const animekb = require('./anime/animekb')
const animeid = require('./anime/animeid')
const jkanime = require('./anime/jkanime')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

servers = {
    animekb,
    animeid,
    jkanime
}

app.get('/', async (req, res) => {

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
            let response = server[body.action](html);
            res.json({ success: true, data: response });
        } catch (e) {
            res.json({ success: false, error: e });
        }
    } else {
        res.json({ success: false });
    }

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

app.listen(process.env.PORT);
