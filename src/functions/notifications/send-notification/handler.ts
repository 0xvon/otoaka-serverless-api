import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    APIClient,
    CognitoClient,
} from '@libs/clients';
import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const idToken = await CognitoClient.signin('admin', 'howbeautiful69is');
        const response = await APIClient.sendNotification({
            message: event.body.message,
            segment: event.body.segment,
        }, idToken)
        return formatJSONResponse({ result: response });
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
