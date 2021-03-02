const axios = require('axios');

interface Props {
    endpoint: string;
    idToken: string;
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
                'Authorization': `Bearer ${this.props.idToken}`,
            },
            responseType: 'json',
        });
        
        const res = await apiAxios.post('/groups', request);
        return res;
    }
}