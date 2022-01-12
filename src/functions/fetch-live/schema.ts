export default {
    type: "object",
    properties: {
        name: { type: 'string' },
        from: { type: 'string' },
    },
    required: ['name', 'from']
} as const;
