import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { YouTubeClient } from './Clients/YoutubeClient';
import { APIClient, CreateGroupRequest } from './Clients/APIClient';
import { S3Client } from './Clients/S3Client';
import schema from './schema';

const apiKey = process.env.YOUTUBE_API_KEY ?? '';
const endpointUrl = process.env.ENDPOINT_URL ?? '';
const bucketName = process.env.S3_BUCKET ?? '';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const youtubeClient = new YouTubeClient({ apiKey: apiKey });
    const s3Client = new S3Client(bucketName);
    const apiClient = new APIClient({ endpoint: endpointUrl, idToken: event.body.id_token });

    const listChannelResponse = await youtubeClient.listChannel(event.body.youtube_channel_id);
    console.log(listChannelResponse);

    if (listChannelResponse.items) {
        const item = listChannelResponse.items[0];
        console.log(item);
        const biography = item.snippet.description;
        const thumbnailUrl = item.snippet.thumbnails.high.url ?? '';

        const s3PutObjRes = await s3Client.upload(thumbnailUrl, event.body.youtube_channel_id);
        if (s3PutObjRes.ETag) {
            const artworkURL = `https://${bucketName}.s3-ap-northeast-1.amazonaws.com/assets/imported/${event.body.youtube_channel_id}.jpeg`;
            const req: CreateGroupRequest = {
                name: event.body.name,
                englishName: null,
                biography: biography,
                since: null,
                artworkURL: artworkURL,
                twitterId: event.body.twitter_id,
                youtubeChannelId: event.body.youtube_channel_id,
                hometown: null,
            };

            const res = await apiClient.createGroup(req);
            console.log(res);
        }
    }

    return formatJSONResponse({
        message: 'hello',
        event,
    });
}

export const main = middyfy(handler);
