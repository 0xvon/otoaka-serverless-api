import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    APIClient,
    Auth0Client,
} from '@libs/clients';

const handler: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    try {
        const idToken = await Auth0Client.signin('admin', 'howbeautiful69!s');

        const groups = await APIClient.getAllGroup(idToken);
        for (const group of groups) {
            APIClient.fetchLive({ name: group.name }, idToken);
        }
        return formatJSONResponse({ res: 'ok' });
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
