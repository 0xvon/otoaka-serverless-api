import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'create_post',
                request: {
                    schema: {
                        'application/json': schema
                    }
                }
            }
        }
    ],
    environment: {
        ENDPOINT_URL: process.env.ENDPOINT_URL,
        COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
        COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
        COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
        S3_BUCKET: process.env.S3_BUCKET,
    },
}