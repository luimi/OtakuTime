# OtakuTime
OtakuTime, es el app para poder ver animes y leer mangas extrayendo el contenido de otras paginas web y mostrarlos en un solo lugar.

[Demo OtakuTime](https://otakutime.netlify.app) 


[![Netlify Status](https://api.netlify.com/api/v1/badges/d681a741-1f6a-46ac-ad53-b8a2ac0318ec/deploy-status)](https://app.netlify.com/sites/otakutime/deploys)
## Clonar
```terminal
git clone https://github.com/luimi/OtakuTime.git
cd OtakuTime
```

## Servidor
Servidor hecho en NodeJs

### Local
```terminal
cd server
npm i
npm start
```

### Docker
```terminal
docker build .
docker images
#copiar IMAGE ID de <none> <none> image
docker run -it -d -p 8000:80 IMAGE_ID
```

### API
`GET /anime`
**Response**
```json
{
  "success": true,
  "data": [
    {
      "name": "ServerName",
      "server": "server",
      "url": "url",
      "hasDownload": true,
      "hasStream": false
    }
  ]
}
```
`GET /manga`
**Response**
```json
{
  "success": true,
  "data": [
    {
      "name": "ServerName",
      "server": "server",
      "url": "url"
    }
  ]
}
```
`GET /extract`
**Response**
```json
{
  "success": true,
  "data": "..."
}
```
`GET /image?url={image}`
**Response**
```json
binary
```
`GET /transfer?text={text}`
**Response**
```json
{
  "query":"text"
}
```
`POST /extract`
**body**
```json
{
  "main": "url",
  "search": "url",
  "episodes": "url",
  "episode": "url"
}
```
**Response**
```json
{
  "success": true,
  "data": "..."
}
```
`POST /`
**body**
```json
{
  "action": "main|search|episodes|episodes",
  "server": "server",
  "url": "url",
  "query": "search query"
}
```
**Response**
```json
{
  "success": true,
  "data": "..."
}
```

## Cliente
Aplicacion hecha en IONIC 

### Local
```terminal
cd client/
npm i
ionic serve
```