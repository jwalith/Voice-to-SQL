export const resolvers = {
    Query: {
        history: () => [],
        settings: () => ({ voice: 'default', systemPrompt: 'You are a helpful assistant.' }),
    },
};
