export default {
    type: "object",
    properties: {
        liveId: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        relatedLink: { type: 'string' },
        since: { type: 'string' },
        until: { type: 'string' },
    },
    required: ['liveId', 'title', 'description', 'since', 'until']
} as const;
