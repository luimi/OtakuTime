const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')
require("dotenv").config()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/test.html'))
})
app.get('/getPage', (req, res) => {
    if(!req.query.url){
        res.send("<h1>No se encontro la URL</h1>")
        return
    }
    axios
      .get(req.query.url)
      .then((response) => {
        let html = response.data;
        res.send(html);
      })
      .catch((e) => {
        res.send(e.message);
      });
})
app.get('/image', (req, res) => {
    if(!req.query.url){
        res.send("<h1>No se encontro la URL</h1>")
        return
    }
    axios
      .get(req.query.url, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        res.send(Buffer.from(response.data, "binary"));
      });
})
app.get('/wordpress', (req,res) => {
    /*
    /wp-json/wp/v2/posts
    /?rest_route=/wp/v2/posts
    /wp-json/wp/v2/users/me
    /wp-json/wp/v2/users
    /wp-json/wp/v2/users/14498
    /wp-json/?_jsonp=receiveData
    */
    if(!req.query.url){
        res.send("<h1>No se encontro la URL</h1>")
        return
    }
    axios
      .get(req.query.url+"/wp-json/wp/v2/posts")
      .then((response) => {
        let json = response.data;
        res.json(json);
      })
      .catch((e) => {
        res.send(e.message);
      });
})
app.listen(process.env.PORT)