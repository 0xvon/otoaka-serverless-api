import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { YouTubeClient } from './Clients/YoutubeClient';
import { S3Client } from './Clients/S3Client';
import schema from './schema';

const apiKey = process.env.YOUTUBE_API_KEY ?? '';
const authUser = process.env.AUTH_USER ?? '';
const endpointUrl = process.env.ENDPOINT_URL ?? '';
const bucketName = process.env.S3_BUCKET ?? '';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const youtubeClient = new YouTubeClient({ apiKey: apiKey });
    const s3Client = new S3Client(bucketName);

    const listChannelResponse = await youtubeClient.listChannel(event.body.youtube_channel_id);
    console.log(listChannelResponse);

    if (listChannelResponse.items) {
        const item = listChannelResponse.items[0];
        const biography = item.snippet.description ?? '';
        const thumbnailUrl = item.snippet.thumbnails.high.url ?? '';

        const s3PutObjRes = await s3Client.upload(thumbnailUrl, event.body.youtube_channel_id)
        console.log(s3PutObjRes);
    }

    return formatJSONResponse({
        message: 'hello',
        event,
    });
}

export const main = middyfy(handler);
