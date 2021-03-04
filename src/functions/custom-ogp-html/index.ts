import { handlerPath } from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'custom_ogp_html',
            }
        }
    ],
    environment: {
        REDIRECT_URL: process.env.REDIRECT_URL,
    },
}
