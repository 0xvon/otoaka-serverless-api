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

            if (piaEventResponse.searchHeader.resultCount === 0) {
                console.log('no event release');
                continue;
            }

            // add groups
            for (const eventRelease of piaEventResponse.eventReleases.eventRelease) {
                let style: LiveStyleInput;
                let groupIds = [];
                for (const perform of eventRelease.performs.perform) {
                    if (perform.appearArtists) {
                        for (const appearArtist of perform.appearArtists.appearArtist) {
                            console.log(`appearArtist name is ${appearArtist.artistName}`);
                            const g = groups.filter((val) => val.name === appearArtist.artistName)[0];
                            console.log(`id is ${g?.id}`);
                            if (g) { groupIds.push(g.id); }
                        }
                    }
                    if (perform.appearMainArtists) {
                        for (const appearMainArtist of perform.appearMainArtists.appearMainArtist) {
                            console.log(`appearMainArtist name is ${appearMainArtist.artistName}`);
                            const g = groups.filter((val) => val.name === appearMainArtist.artistName)[0];
                            console.log(`id is ${g?.id}`);
                            if (g) { groupIds.push(g.id); }
                        }
                    }
                }

                if (groupIds.length === 0 || eventRelease.performs.perform.length === 0) {
                    console.log('no groups or performs');
                    continue;
                }

                // style
                if (eventRelease.performs?.perform.length === 1) {
                    if (groupIds.length === 1) {
                        style = {
                            kind: LiveStyle.oneman,
                            value: groupIds[0],
                        };
                    } else {
                        style = {
                            kind: LiveStyle.battle,
                            value: groupIds,
                        };
                    }
                } else {
                    style = {
                        kind: LiveStyle.festival,
                        value: groupIds,
                    };
                }

                if (!style){
                    console.log('style not determined');
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
