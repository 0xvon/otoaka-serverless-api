export default {
    type: "object",
    properties: {
        message: { type: 'string' },
        segment: { type: 'string' }
    },
    required: ['message']
} as const;
