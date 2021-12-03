import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    APIClient,
    CognitoClient,
} from '@libs/clients';

const handler: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    try {
        const idToken = await CognitoClient.signin('admin', 'howbeautiful69is');
        const response = await APIClient.notifyUpcomingLives(idToken);
        return formatJSONResponse({ result: response });
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
