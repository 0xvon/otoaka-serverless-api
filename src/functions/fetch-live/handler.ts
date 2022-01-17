import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    APIClient,
    Auth0Client,
} from '@libs/clients';
import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const idToken = await Auth0Client.signin('admin', 'howbeautiful69!s');
        APIClient.fetchLive({
            name: event.body.name,
            from: event.body.from,
        } , idToken);
        return formatJSONResponse({ res: 'ok' });
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
