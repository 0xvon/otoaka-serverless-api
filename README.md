## Rocket Serverless API

サーバーサイドAPIを叩くためのServerless Application

|||
|---|---|
|CreateGroup|Groupの作成|
|CreateLive|Liveの作成|
|CreateSocialTipEvent|SocialTipEventの作成|
|CustomOgpHtml|動的なOGP・リダイレクト先を返すHTML|
|EntryGroup|EntryGroupの作成|
|Notifications|各種push通知の送信|

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

## Execute Locally

```
$ sls offline start --stage local
```

then

```
$ curl -X POST 'localhost:3000/local/create_live' \
    -d '{"title":"DEAD POP FESTiVAL 2021","performers":["SiM","THE ORAL CIGARETTES","DRAGON ASH","coldrain","ハルカミライ","AGE FACTORY","ORANGE RANGE","Survive Said the Prophet","HEY SMITH","crossfaith","マキシマム ザ ホルモン","Fear, and Loathing in Las Vegas","SHADOWS","SHANK","SCANDAL","Creepy Nuts"],"artworkURL":"https://deadpopfest.com/wp-content/themes/deadpop/images/ogp.jpg","liveHouse":"川崎市東扇島東公園特設会場","date":"20210626","openAt":"09:00","startAt":"12:00"}' \
    -H 'Content-Type:application/json'
```
