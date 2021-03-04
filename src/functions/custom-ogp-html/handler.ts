import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const redirectUrl = process.env.REDIRECT_URL ?? '';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    return formatJSONResponse({
        message: 'hello',
        event,
    });
}

export const main = middyfy(handler);
