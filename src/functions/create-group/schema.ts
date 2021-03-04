export default {
    type: "object",
    properties: {
        name: { type: 'string' },
        youtube_channel_id: { type: 'string' },
        twitter_id: { type: 'string' },
        id_token: { type: 'string' },
    },
    required: ['name', 'youtube_channel_id', 'twitter_id', 'id_token']
} as const;
