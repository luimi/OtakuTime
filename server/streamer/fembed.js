const fetch = require("node-fetch")

const getJSON = async (url) => {
    const redirect = await fetch(url).then(res => res.url.replace("/v/", "/api/source/"))
    const video = await fetch(redirect, { method: "POST" }).then(res => res.json())
    if (!video["success"]) return { success: false }
    return video
}

const getFetchHeader = async (headers) => {
    const data = {}
    for (let [key, value] of headers) {
        data[key] = value
    }
    return data
}

const getVideo = async (req, res, url) => {
    const videoJSON = await getJSON(url)
    if (!videoJSON["success"]) return res.send(await url.embed())
    const videoURL = videoJSON.data[0].file;
    return await fetch(videoURL, { headers: { range: req.headers.range } })
    .then(async response => {
        if (!response.ok) return res.send(await url.embed())
        res.set(await getFetchHeader(response.headers))
        response.body.pipe(res.status(206))
        response.body.on('error', () => { })
    })
}

module.exports = {
    regex: /https\:\/\/www.fembed.com\/(\S)*/,
    getVideo: getVideo
}