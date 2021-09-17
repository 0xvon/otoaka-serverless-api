import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    CognitoClient,
    APIClient,
    S3Client,
} from '../clients';
import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const idToken = await CognitoClient.createUser(event.body.username, event.body.email, event.body.password);
        const isSignedUp = APIClient.getSignupStatus(idToken);
        console.log(`isSignedUp: ${isSignedUp}`);

        const key = new Date().getTime().toString(16)  + Math.floor(1000 * Math.random()).toString(16);
        const imageUrl = await S3Client.upload(event.body.thumbnail_url, key);

        const request: APIClient.SignupRequest = {
            name: event.body.displayName,
            biography: event.body.biography,
            thumbnailURL: imageUrl,
            role: {
                kind: 'fan',
                value: {},
            },
        };
        const user = isSignedUp
            ? await APIClient.editUserInfo(request, idToken)
            : await APIClient.signup(request, idToken);
        
        console.log(`user: ${JSON.stringify(user)}`);
        return formatJSONResponse({
            idToken: idToken,
            userId: user.id,
        });
    } catch(e) {
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
