export default {
    type: "object",
    properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        displayName: { type: 'string' },
        biography: { type: 'string' },
        thumbnail_url: { type: 'string' },
        role: { type: 'string' },
    },
    required: ['username', 'email', 'password', 'displayName', 'biography', 'thumbnail_url', 'role']
} as const;
