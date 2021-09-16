import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    CognitoClient
} from '../clients';
import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const idToken = CognitoClient.createUser(event.body.username, event.body.email, event.body.password);
        return formatJSONResponse({
            idToken: JSON.stringify(idToken),
        });
    } catch(e) {
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
