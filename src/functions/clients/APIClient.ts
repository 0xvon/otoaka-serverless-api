const axios = require('axios');
import { decycle } from 'json-cyclic';


interface Props {
    endpoint: string;
    idToken?: string;
}

export interface CreateGroupRequest {
    name: string;
    englishName: string | null;
    biography: string | null;
    since: Date | null;
    artworkURL: string | null;
    twitterId: string | null;
    youtubeChannelId: string | null;
    hometown: string | null;
}

export interface LiveStyleInput {
    kind: LiveStyle;
    value: string | string[]; // group id
}

interface searchPiaLiveParams {
    piaApiKey: string;
    keyword?: string;
    sort?: string;
    get_count?: number;
}

export type LiveStyle = 'oneman' | 'battle' | 'festival';

export interface CreateLiveRequest {
        title: string;
        style: LiveStyleInput
        price: number;
        artworkURL: string | null;
        hostGroupId: string
        liveHouse: string | null;
        date: string | null;
        openAt: string | null;
        startAt: string | null;
        piaEventCode: string | null;
        piaReleaseUrl: string | null;
        piaEventUrl: string | null;
}

export interface Group {
    id: string;
    name: string;
}

export class APIClient {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    createGroup = async (request: CreateGroupRequest) => {
        const apiAxios = axios.create({
            baseURL: this.props.endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        
        const res = await apiAxios.post('/external/create_group', request);
        return res;
    }

    getAllGroup = async () => {
        console.log('calling /external/groups ...');
        const apiAxios = axios.create({
            baseURL: this.props.endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        
        const res = await apiAxios.get('/external/groups');
        // console.log(JSON.stringify(decycle(res)));
        return res.data as Group[];
    }

    searchPiaLive = async (params: searchPiaLiveParams) => {
        console.log(`calling /external/test_pia_event_release (query: ${params.keyword}) ...`);

        const apiAxios = axios.create({
            baseURL: this.props.endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        
        const res = await apiAxios.get('/external/test_pia_event_release', { params: params });
        console.log(JSON.stringify(decycle(res)));
        return res.data;
    }

    fetchLive = async (request: CreateLiveRequest) => {
        console.log(`calling /external/fetch_live (title: ${request.title}) ...`);
        const apiAxios = axios.create({
            baseURL: this.props.endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        
        const res = await apiAxios.post('/external/fetch_live', request);
        return res.data;
    }

    createLive = async (request: CreateLiveRequest) => {
        console.log(`calling /external/create_live (title: ${request.title}) ...`);
        const apiAxios = axios.create({
            baseURL: this.props.endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        
        const res = await apiAxios.post('/external/create_live', request);
        return res.data;
    }
}