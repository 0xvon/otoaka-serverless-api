## Rocket Serverless API

Serverless Application
- create group
- create live
- custom ogp html
- fetch pia lives

## Dependencies

- AWS(API Gateway + Lambda)
- Serverless Framework
- TypeScript
- Node.js 14.x

## Setup

```
$ npm i
```

## Deploy

```
$ sls deploy
```

## Execute in local

```
$ sls offline start --stage local
```

then

```
$ curl -X POST 'localhost:3000/local/create_live' \
    -d '{"title":"DEAD POP FESTiVAL 2021","performers":["SiM","THE ORAL CIGARETTES","DRAGON ASH","coldrain","ハルカミライ","AGE FACTORY","ORANGE RANGE","Survive Said the Prophet","HEY SMITH","crossfaith","マキシマム ザ ホルモン","Fear, and Loathing in Las Vegas","SHADOWS","SHANK","SCANDAL","Creepy Nuts"],"artworkURL":"https://deadpopfest.com/wp-content/themes/deadpop/images/ogp.jpg","liveHouse":"川崎市東扇島東公園特設会場","date":"20210626","openAt":"09:00","startAt":"12:00"}' \
    -H 'Content-Type:application/json'
```
