import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { decycle } from 'json-cyclic';
import {
    APIClient,
    // LiveStyle,
} from '../clients';

const endpointUrl = process.env.ENDPOINT_URL ?? '';
const piaApiKey = process.env.PIA_API_KEY ?? '';
// const piaEndpointUrl = process.env.PIA_ENDPOINT_URL
// const bucketName = process.env.S3_BUCKET ?? '';

const handler: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    const apiClient = new APIClient({ endpoint: endpointUrl });
    try {
        const groups = await apiClient.getAllGroup();
        for (const group of groups) {
            const eventRelease = await apiClient.searchPiaLive({
                piaApiKey: piaApiKey,
                keyword: group.name,
            });
            if (!eventRelease.eventReleases) { continue; }

            console.log(JSON.stringify(decycle(eventRelease.eventReleases.eventRelease)));
            return formatJSONResponse(eventRelease.eventReleases);
        }
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

export const main = middyfy(handler);
