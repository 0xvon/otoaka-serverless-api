export default {
    type: "object",
    properties: {
        name: { type: 'string' },
        youtube_channel_id: { type: 'string' },
        twitter_id: { type: 'string' },
    },
    required: ['name', 'youtube_channel_id', 'twitter_id']
} as const;
