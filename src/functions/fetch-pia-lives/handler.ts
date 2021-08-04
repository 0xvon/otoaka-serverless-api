import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
    APIClient,
    PiaClient,
    // LiveStyle,
} from '../clients';

const endpointUrl = process.env.ENDPOINT_URL ?? '';
const piaApiKey = process.env.PIA_API_KEY ?? '';
const piaEndpointUrl = process.env.PIA_ENDPOINT_URL
// const bucketName = process.env.S3_BUCKET ?? '';

const handler: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    const apiClient = new APIClient({ endpoint: endpointUrl });
    const piaClient = new PiaClient({apiKey: piaApiKey, uri: piaEndpointUrl })
    try {
        const groups = await apiClient.getAllGroup();
        for (const group of groups) {
            const events = await piaClient.searchEvents(group.name);
            console.log(events);
            return formatJSONResponse(events);
            for (const eventRelease of events.eventReleases.eventRelease) {
                console.log(eventRelease);
                // let style: LiveStyle;
                // if (eventRelease.performs.perform[0].appearArtist) {
                //     style = LiveStyle.festival;
                // } else {
                //     style = LiveStyle.oneman;
                // }
                // const live = await apiClient.fetchLive({
                //     title: eventRelease.event.mainTItle,
                //     style: {
                //         kind: style,
                //         value: 
                //     }
                // })
            }
            // return formatJSONResponse(events);
        }
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
