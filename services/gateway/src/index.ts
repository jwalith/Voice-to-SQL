import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { WebSocketServer } from 'ws';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { setupGrpcStream } from './grpc-client';

const PORT = 4000;

async function startServer() {
    // 1. GraphQL Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: PORT },
    });
    console.log(`🚀 GraphQL Server ready at ${url}`);

    // 2. WebSocket Server for Audio
    const wsServer = new WebSocketServer({ port: 4001 });
    console.log(`🚀 WebSocket Server ready at ws://localhost:4001`);

    wsServer.on('connection', (ws) => {
        console.log('Client connected to WebSocket');
        setupGrpcStream(ws);
    });
}

startServer();
