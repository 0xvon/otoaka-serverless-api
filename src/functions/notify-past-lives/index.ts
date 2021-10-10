import { handlerPath } from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'notify_past_lives',
            }
        },
        {
            schedule: 'cron(0 12 * * ? *)',
        },
    ],
    timeout: 300,
    environment: {
        ENDPOINT_URL: process.env.ENDPOINT_URL,
        PIA_API_KEY: process.env.PIA_API_KEY,
        PIA_ENDPOINT_URL: process.env.PIA_ENDPOINT_URL,
        YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
        COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
        COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
        COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
        S3_BUCKET: process.env.S3_BUCKET,
    },
}
