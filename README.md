## Server
### local

```terminal
cd server
npm i
npm start
```

### Docker

```terminal
git clone https://github.com/luimi/OtakuTime.git
cd OtakuTime
docker build .
docker images
#copy de IMAGE ID of <none> <none> image
docker run -it -d -p 8000:80 IMAGE_ID

```