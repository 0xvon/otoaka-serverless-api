export default {
    type: "object",
    properties: {
        title: { type: 'string' },
        performers: { type: 'array' },
        artworkURL: { type: 'string' },
        liveHouse: { type: 'string' },
        date: { type: 'string' },
        openAt: { type: 'string' },
        startAt: { type: 'string' },
        endDate: { type: 'string' },
        piaEventCode: { type: 'string' },
    },
    required: ['title', 'performers', 'liveHouse', 'date', 'openAt', 'startAt']
} as const;
