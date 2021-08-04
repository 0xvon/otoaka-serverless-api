const axios = require('axios');

interface Props {
    apiKey: string;
    uri: string;
}

export class PiaClient {
    props: Props

    constructor(props: Props) {
        this.props = props;
    }

    searchEvents = async (query: string) => {
        const apiAxios = axios.create({
            baseURL: this.props.uri,
            headers: {
                'Content-Type': 'application/xml',
                'End-User-Agent': 'N252i DoCoMo/1.0/N252i/c10/TB/W22H10',
            },
            responseType: 'document',
        })

        const params = {
            keyword: query,
            sort: 'D',
            apikey: this.props.apiKey,
            get_count: 100,
        };

        const response = await apiAxios.get(this.props.uri + '/1.1/event_releases', { params: params });
        return response.data;
    }
}