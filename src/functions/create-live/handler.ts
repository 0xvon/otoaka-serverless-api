import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    // S3Client,
    APIClient,
    Auth0Client,
} from '@libs/clients';
import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log(`event body title: ${event.body.title}`);
    try {
        const idToken = await Auth0Client.signin('admin', 'howbeautiful69!s');
        const groups = await APIClient.getAllGroup(idToken);
        const performerIds = [];

        // determine performers
        event.body.performers.forEach(performer => {
            const gId = groups.filter(group => group.name === performer)[0]?.id
            if (gId) { performerIds.push(gId); } else { console.log(`${performer} not found`); }
        })

        if (performerIds.length === 0) {
            return formatJSONResponse({ result: 'no performers found' }, 400);
        }

        // upload artwork url
        let imageUrl = null;
        if (event.body.artworkURL) {
            // const key = new Date().getTime().toString(16)  + Math.floor(1000 * Math.random()).toString(16)
            // imageUrl = await S3Client.upload(event.body.artworkURL, key);
            imageUrl = event.body.artworkURL;
        }

        // determine live style
        let style: APIClient.LiveStyleInput;
        if (performerIds.length === 1) {
            style = {
                kind: 'oneman',
                value: performerIds[0],
            };
        } else {
            style = {
                kind: 'festival',
                value: performerIds,
            };
        }
        
        // create live
        const res = await APIClient.createLive({
            title: event.body.title,
            style: style,
            price: 5000,
            artworkURL: imageUrl,
            hostGroupId: performerIds[0],
            liveHouse: event.body.liveHouse,
            date: event.body.date,
            endDate: event.body.endDate,
            openAt: event.body.openAt,
            startAt: event.body.startAt,
            piaEventCode: event.body.piaEventCode,
            piaReleaseUrl: null,
            piaEventUrl: null,
        }, idToken);
        console.log(res);
        return formatJSONResponse({ res });
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
