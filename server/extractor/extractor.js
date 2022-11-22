const express = require('express');
const app = express();
const cheerio = require("cheerio");
const fs = require("fs");
const html = fs.readFileSync("source").toString();
const axios = require("axios");
require("dotenv").config();
// DOC https://zetcode.com/javascript/cheerio/
const extract = async () => {
  let $ = cheerio.load(html);
  const root = "";
  //-----------------------------
  
  return {};
}
app.get('/', async (req, res) => {
  res.send(await extract());
});

app.listen(process.env.PORT)