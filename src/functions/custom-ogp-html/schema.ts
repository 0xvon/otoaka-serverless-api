export default {
    type: "object",
    properties: {
        ogp_url: { type: 'string' },
        title: { type: 'string' },
    },
    required: ['ogp_url', 'title']
} as const;
