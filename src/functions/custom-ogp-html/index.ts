import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'custom_ogp_html',
                request: {
                    schema: {
                        'text/html': schema
                    }
                }
            }
        }
    ],
    environment: {
        REDIRECT_URL: process.env.REDIRECT_URL,
    },
}
