const axios = require('axios');
const request = require('request-promise');

interface Props {
    apiKey: string;
}

export class YouTubeClient {
    props: Props

    constructor(props: Props) {
        this.props = props;
    }

    listChannel = async (channelId: string): Promise<any> => {
        const uri = 'https://www.googleapis.com/youtube/v3/channels';
        const params = {
            url: uri,
            method: 'GET',
            qs: {
                id: channelId,
                maxResults: 1,
                part: 'snippet',
                key: this.props.apiKey,
            }
        };

        const response = await axios.get(uri, { params: params });
        return response.data;
    };
}