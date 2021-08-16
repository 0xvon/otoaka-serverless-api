import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'create_live',
                request: {
                    schema: {
                        'application/json': schema
                    }
                }
            }
        }
    ],
    timeout: 300,
    environment: {
        ENDPOINT_URL: process.env.ENDPOINT_URL,
        S3_BUCKET: process.env.S3_BUCKET,
    },
}
