import { handlerPath } from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'custom_ogp_html',
                response: {
                    headers: {
                        'Content-Type': "'text/html'",
                    },
                },
            },
        },
    ],
    environment: {
        REDIRECT_URL: "https://apps.apple.com/jp/app/rocket-for-bands-ii/id1550896325",
    },
}
