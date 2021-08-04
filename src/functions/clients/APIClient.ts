const axios = require('axios');

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

export enum LiveStyle {
    oneman, battle, festival
}

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
                // 'Authorization': `Bearer ${this.props.idToken}`,
            },
            responseType: 'json',
        });
        
        const res = await apiAxios.post('/external/create_group', request);
        return res;
    }

    getAllGroup = async () => {
        const apiAxios = axios.create({
            baseURL: this.props.endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        
        const res = await apiAxios.get('/external/groups');
        return res.items as Group[];
    }

    fetchLive = async (request: CreateLiveRequest) => {
        const apiAxios = axios.create({
            baseURL: this.props.endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        
        const res = await apiAxios.post('/external/fetch_live', request);
        return res;
    }
}