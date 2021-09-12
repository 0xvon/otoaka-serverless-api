import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { decycle } from 'json-cyclic';
import {
    APIClient,
    LiveStyleInput,
} from '../clients';

const endpointUrl = process.env.ENDPOINT_URL ?? '';
const piaApiKey = process.env.PIA_API_KEY ?? '';

const handler: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    const apiClient = new APIClient({ endpoint: endpointUrl });
    try {
        const groups = await apiClient.getAllGroup();
        for (const group of groups) {
            _sleep(1000);
            const piaEventResponse = await apiClient.searchPiaLive({
                piaApiKey: piaApiKey,
                keyword: group.name,
            });

            if (piaEventResponse.searchHeader.resultCount === 0) {
                console.log('no event release');
                continue;
            }

            // add each event release to DB
            for (const eventRelease of piaEventResponse.eventReleases.eventRelease) {
                let style: LiveStyleInput;
                let groupIds = [];
                for (const perform of eventRelease.performs.perform) {
                    if (perform.appearArtists) {
                        for (const appearArtist of perform.appearArtists.appearArtist) {
                            const g = groups.filter((val) => val.name === zen2han(appearArtist.artistName))[0];
                            if (g) { groupIds.push(g.id); }
                        }
                    }
                    if (perform.appearMainArtists) {
                        for (const appearMainArtist of perform.appearMainArtists.appearMainArtist) {
                            const g = groups.filter((val) => val.name === zen2han(appearMainArtist.artistName))[0];
                            if (g) { groupIds.push(g.id); }
                        }
                    }
                }

                // make unique
                groupIds = [...new Set(groupIds)];

                if (groupIds.length === 0 || eventRelease.performs.perform.length === 0) {
                    console.log('no groups or performs');
                    continue;
                }

                // determine style
                if (eventRelease.performs?.perform[0].appearMainArtists) {
                    if (eventRelease.performs?.perform[0].appearArtists) {
                        style = {
                            kind: 'battle',
                            value : groupIds,
                        }
                    } else {
                        style = {
                            kind: 'oneman',
                            value: groupIds[0],
                        };
                    }
                } else {
                    style = {
                        kind: 'festival',
                        value: groupIds,
                    };
                }

                if (!style){
                    console.log('style not determined');
                    continue;
                }
                const dateRange = eventRelease.performs.perform.map((r) => r.performDate ).sort()

                const live = await apiClient.fetchLive({
                    title: zen2han(eventRelease.event.mainTitle),
                    style: style,
                    price: 5000, // don't use this paramater
                    artworkURL: eventRelease.event.imageUrlXls?.imageUrlXl[0]?.imageUrl,
                    hostGroupId: group.id,
                    liveHouse: zen2han(eventRelease.performs.perform[0].venue.venueName),
                    date: dateRange[0],
                    endDate: dateRange.length === 1 ? null : dateRange.slice(-1)[0],
                    openAt: eventRelease.performs.perform[0].openTime,
                    startAt: eventRelease.performs.perform[0].performStartTime,
                    piaEventCode: eventRelease.event.eventCode,
                    piaReleaseUrl: eventRelease.release.releaseUrlPc,
                    piaEventUrl: eventRelease.event.eventUrlPc,
                });
                
                console.log(`live is ${JSON.stringify(decycle(live))}`);
            }
        }
        return formatJSONResponse({ result: 'ok' });
    } catch(e) {
        console.log(e);
        return formatJSONResponse(e, 500);
    }
}

const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const zen2han =(str: string) => {
    return str.replace(/[！-～]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

export const main = middyfy(handler);
