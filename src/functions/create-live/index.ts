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
        COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
        COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
        COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
        S3_BUCKET: process.env.S3_BUCKET,

        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    },
}
