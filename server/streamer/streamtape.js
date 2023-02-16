const cheerio = require("cheerio")
const axios = require("axios")

const getVideo = async (req, res, url) => {
    let tokenRegex = /&token=[a-zA-Z_0-9]*/g
    let result = url
    let token = "";
    axios
        .get(url)
        .then(async (response) => {
            let html = response.data;
            let $ = cheerio.load(html);
            let link = $("#robotlink").text()
            link = link.substring(0, link.lastIndexOf("="))
            $("script").each((a, e) => {
                let script = $(e).text()
                if (script.includes("&token=")) {
                    script.match(tokenRegex).forEach((_token) => {
                        token = _token.replace("&token=", "")
                    })
                }
            })
            result = `https:/${link}=${token}&stream=1`;
            res.send(await result.embed())
        })
        .catch(async (e) => {
            res.send(await url.embed());
        });
}

module.exports = {
    regex: /https\:\/\/streamtape.com\/(\S)*/,
    getVideo: getVideo
}