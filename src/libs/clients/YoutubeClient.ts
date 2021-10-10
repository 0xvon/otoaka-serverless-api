import axios from 'axios';

const apiKey = process.env.YOUTUBE_API_KEY ?? '';

export const listChannel = async (channelId: string): Promise<any> => {
    const uri = 'https://www.googleapis.com/youtube/v3/channels';
    const params = {
        id: channelId,
        maxResults: 1,
        part: 'snippet',
        key: apiKey,
    };

    const response = await axios.get(uri, { params: params });
    return response.data;
};