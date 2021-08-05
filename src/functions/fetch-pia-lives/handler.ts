import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
// import { decycle } from 'json-cyclic';
import {
    APIClient,
    LiveStyleInput,
    LiveStyle,
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
            _sleep(5000);
            const piaEventResponse = await apiClient.searchPiaLive({
                piaApiKey: piaApiKey,
                keyword: group.name,
            });
            if (!piaEventResponse.eventReleases) { continue; }
            for (const eventRelease of piaEventResponse.eventReleases.eventRelease) {
                let style: LiveStyleInput;
                if (eventRelease.performs.perform[0].appearArtists && eventRelease.performs.perform[0].appearMainArtists) { // appearArtistsがいればfestival
                    let groupIds: string[] = [];
                    for (const appearMainArtist of eventRelease.performs.perform[0].appearMainArtists.appearMainArtist) {
                        const g = groups.filter((val) => val.name === appearMainArtist.artistName)[0];
                        if (g) { groupIds.push(g.id); }
                    }

                    for (const appearArtist of eventRelease.performs.perform[0].appearArtists.appearArtist) {
                        const g = groups.filter((val) => val.name === appearArtist.artistName)[0];
                        if (g) { groupIds.push(g.id); }
                    }
                    if (!groupIds[0]) { continue; }

                    style = {
                        kind: LiveStyle.festival,
                        value: groupIds,
                    };
                } else if (eventRelease.performs.perform[0].appearMainArtists) { // appearMainArtistsのみならoneman
                    let groupIds: string[] = [];
                    for (const appearMainArtist of eventRelease.performs.perform[0].appearMainArtists.appearMainArtist) {
                        const g = groups.filter((val) => val.name === appearMainArtist.artistName)[0];
                        if (g) { groupIds.push(g.id); }
                    }
                    if (!groupIds[0]) { continue; }

                    style = {
                        kind: LiveStyle.oneman,
                        value: groupIds[0],
                    };
                } else {
                    console.log('appearMainArtists and appearArtists are null');
                    continue;
                }

                const live = await apiClient.fetchLive({
                    title: eventRelease.event.mainTitle,
                    style: style,
                    price: 5000, // don't use this paramater
                    artworkURL: eventRelease.event.imageUrlXls?.imageUrlXl[0]?.imageUrl,
                    hostGroupId: group.id,
                    liveHouse: eventRelease.performs.perform[0].venue.venueName,
                    date: eventRelease.performs.perform[0].performDate,
                    openAt: eventRelease.performs.perform[0].openTime,
                    startAt: eventRelease.performs.perform[0].performStartTime,
                    piaEventCode: eventRelease.event.eventCode,
                    piaReleaseUrl: eventRelease.release.releaseUrlMobile,
                    piaEventUrl: eventRelease.event.eventUrlMobile,
                });
                
                return formatJSONResponse(live); 
            }
        }
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const main = middyfy(handler);
