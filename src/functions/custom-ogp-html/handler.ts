import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatHTMLResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const redirectUrl = process.env.REDIRECT_URL ?? 'https://wall-of-death.com/otoaka/';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log(event);

    const ogpUrl = event.queryStringParameters['ogp_url'] ?? 'https://wall-of-death.com';
    const title = event.queryStringParameters['title'] ?? 'OTOAKA | ライブの感想やセトリを記録・共有しよう';
    console.log(title);

    return formatHTMLResponse(generatehtml(ogpUrl, title));
}

const generatehtml = (ogp_url: string, title: string) => {
    const description = 'ライブの価値を。迫力を。感動を。伝えるのはあなたの役目。';
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
    <script type="text/javascript">
        window.onload = function() {
            window.location.replace("${redirectUrl}");
        }
    </script>
</head>
<body>
</body>
</html>
    `
}

export const main = middyfy(handler);
