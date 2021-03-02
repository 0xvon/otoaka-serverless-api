import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { YouTubeClient } from './youtubeClient';
import schema from './schema';

const apiKey = process.env.YOUTUBE_API_KEY ?? '';
const authUser = process.env.AUTH_USER ?? '';
const endpointUrl = process.env.ENDPOINT_URL ?? '';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const youtubeClient = new YouTubeClient({ apiKey: apiKey });
    const listChannelResponse = await youtubeClient.listChannel(event.body.youtube_channel_id);
    console.log(listChannelResponse);

    return formatJSONResponse({
        message: listChannelResponse,
        event,
    });
}

export const main = middyfy(handler);
