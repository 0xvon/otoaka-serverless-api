import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    S3Client,
    YouTubeClient,
    APIClient,
    Auth0Client,
} from '@libs/clients';
import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const listChannelResponse = await YouTubeClient.listChannel(event.body.youtube_channel_id);
        console.log(listChannelResponse);

        if (listChannelResponse.items) {
            const item = listChannelResponse.items[0];
            console.log(item);
            const biography = item.snippet.description;
            const thumbnailUrl = item.snippet.thumbnails.high.url ?? '';
            console.log(`thumbnailUrl: ${thumbnailUrl}`);

            const artworkURL = await S3Client.upload(thumbnailUrl, event.body.youtube_channel_id);
            const req: APIClient.CreateGroupRequest = {
                name: event.body.name,
                englishName: null,
                biography: biography,
                since: null,
                artworkURL: artworkURL,
                twitterId: event.body.twitter_id,
                youtubeChannelId: event.body.youtube_channel_id,
                hometown: null,
            };

            const idToken = await Auth0Client.signin('admin', 'howbeautiful69!s');

            const res = await APIClient.createGroup(req, idToken);
            console.log(res);
        }

        return formatJSONResponse({
            message: 'hello',
            event,
        });
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
