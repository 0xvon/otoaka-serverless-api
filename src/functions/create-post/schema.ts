export default {
    type: "object",
    properties: {
        live_id: { type: 'string' },
        text: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        user_id: { type: 'string' },
    },
    required: ['live_id', 'text', 'username', 'password', 'user_id']
} as const;
