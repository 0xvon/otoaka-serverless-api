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
        const req: APIClient.CreateSocialTipEventRequest = {
            liveId: event.body.liveId,
            title: event.body.title,
            description: event.body.description,
            relatedLink: event.body.relatedLink,
            since: new Date(event.body.since),
            until: new Date(event.body.until),
        };

        const idToken = await Auth0Client.signin('admin', 'howbeautiful69!s');

        const res = await APIClient.createSocialTipEvent(req, idToken);

        return formatJSONResponse({
            res: res,
        });
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
