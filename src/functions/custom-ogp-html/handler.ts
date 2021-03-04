import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const redirectUrl = process.env.REDIRECT_URL ?? '';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log(event);

    const ogpUrl = event.queryStringParameters['ogp_url'] ?? '';
    const title = event.queryStringParameters['title'] ?? 'some title';
    console.log(title);

    return generatehtml(ogpUrl);
}

const generatehtml = (ogp_url: string) => {
    const title = 'ロケバン | ロック音楽シェアSNS';
    const description = 'ロケバンで音楽をシェアしよう';
    const facebookAppId = '313612986723470';
    const twitterId = '@wooruobudesu';

    return `
    <!doctype html>
        <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <meta content="R-bies,INC." name="author" />
          <title>${title}</title>
          <meta content="${description}" name="description">

          <meta content="${facebookAppId}" property="fb:app_id" />
          <meta content="${ogp_url}" property="og:url" />
          <meta content="website" property="og:type" />
          <meta content="ja_JP" property="og:locale" />
          <meta content="${title}" property="og:title" />
          <meta content="${description}" property="og:description" />
          <meta content="${ogp_url}" property="og:image" />
          <meta content="${ogp_url}" property="og:image:secure_url" />
          <meta content="image/png" property="og:image:type" />
          <meta content="1200" property="og:image:width" />
          <meta content="630" property="og:image:height" />

          <meta content="summary_large_image" property="twitter:card" />
          <meta content="${twitterId}" property="twitter:site" />
          <meta content="${title}" property="twitter:title" />
          <meta content="${description}" property="twitter:description" />
          <meta content="${ogp_url}" property="twitter:image" />
        </head>
        <body>
        </body>
        </html>
    `
}

export const main = middyfy(handler);
