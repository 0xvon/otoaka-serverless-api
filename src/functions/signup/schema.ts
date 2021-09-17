export default {
    type: "object",
    properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        displayName: { type: 'string' },
        biography: { type: 'string' },
        thumbnail_url: { type: 'string' },
    },
    required: ['username', 'email', 'password', 'displayName', 'biography', 'thumbnail_url']
} as const;
