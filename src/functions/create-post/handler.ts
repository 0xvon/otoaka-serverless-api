import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    CognitoClient,
    APIClient,
} from '@libs/clients';
import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const idToken = await CognitoClient.signin(event.body.username, event.body.password);

        const request: APIClient.CreatePostRequest = {
            live: event.body.live_id,
            author: event.body.user_id,
            text: event.body.text,
            groups: [],
            tracks: [],
            imageUrls: [],
        };
        const post = await APIClient.createPost(request, idToken);
        
        return formatJSONResponse({
            id: post.id,
        });
    } catch(e) {
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
