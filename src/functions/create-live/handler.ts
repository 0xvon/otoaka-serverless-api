import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    S3Client,
    APIClient,
    LiveStyleInput,
} from '../clients';
import schema from './schema';

const endpointUrl = process.env.ENDPOINT_URL ?? 'http://api-dev.rocketfor.band';
const bucketName = process.env.S3_BUCKET ?? 'rocket-auth-dev-storage';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const s3Client = new S3Client(bucketName);
    const apiClient = new APIClient({ endpoint: endpointUrl});
    // console.log(`event: ${JSON.stringify(event)}`);
    console.log(`event body title: ${event.body.title}`);
    try {
        const groups = await apiClient.getAllGroup();
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
            const key = new Date().getTime().toString(16)  + Math.floor(1000 * Math.random()).toString(16)
            await s3Client.upload(event.body.artworkURL, key);
            imageUrl = `https://${bucketName}.s3-ap-northeast-1.amazonaws.com/assets/imported/${key}.jpeg`;
            // imageUrl = event.body.artworkURL;
        }

        // determine live style
        let style: LiveStyleInput;
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
        const res = await apiClient.createLive({
            title: event.body.title,
            style: style,
            price: 5000,
            artworkURL: imageUrl,
            hostGroupId: performerIds[0],
            liveHouse: event.body.liveHouse,
            date: event.body.date,
            openAt: event.body.openAt,
            startAt: event.body.startAt,
            piaEventCode: event.body.piaEventCode,
            piaReleaseUrl: null,
            piaEventUrl: null,
        });
        console.log(res);
        return formatJSONResponse({ result: 'ok' });
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
