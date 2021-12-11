import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatHTMLResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log(event);
    const ogpUrl = event.queryStringParameters['ogp_url'] ?? 'https://wall-of-death.com';
    const title = event.queryStringParameters['title'] ?? 'OTOAKA | ライブ参戦履歴管理アプリ';
    const redirectUrl = event.queryStringParameters['redirect_url'] ?? 'https://wall-of-death.com/otoaka/';
    console.log(title);

    return formatHTMLResponse(generatehtml(ogpUrl, title, redirectUrl));
}

const generatehtml = (ogp_url: string, title: string, redirectUrl: string) => {
    const description = 'ライブに行く。感想を書いて参戦履歴を記録する。感想を見返して余韻に浸る。そしてまた、ライブに行く。身体はライブを求める。';
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
    <meta
        name="apple-itunes-app"
        content="app-id=1550896325, app-argument=https://wall-of-death.com/otoaka"
    />
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
