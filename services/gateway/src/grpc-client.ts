import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { PROTO_PATH, AudioResponse } from '@jarvis/protos';
import WebSocket from 'ws';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const voiceProto = grpc.loadPackageDefinition(packageDefinition).voice as any;

// Connect to Voice Service at localhost:50051
const client = new voiceProto.VoiceService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

export function setupGrpcStream(ws: WebSocket) {
    const call = client.StreamAudio();

    // Incoming from gRPC (Voice Service) -> Outgoing to WebSocket (Client)
    call.on('data', (response: AudioResponse) => {
        console.log('Gateway received from gRPC:', JSON.stringify(response));
        ws.send(JSON.stringify(response));
    });

    call.on('end', () => {
        console.log('gRPC stream ended');
        ws.close();
    });

    call.on('error', (e: Error) => {
        console.error('gRPC error:', e);
        ws.close();
    });

    // Incoming from WebSocket (Client) -> Outgoing to gRPC (Voice Service)
    ws.on('message', (message: Buffer) => {
        // Try to parse as JSON first (Text/Setup)
        try {
            const parsed = JSON.parse(message.toString());
            if (parsed.type === 'setup') {
                console.log('Gateway sending setup to gRPC');
                call.write({ setup: { session_id: '123', user_id: 'user' } });
                return;
            } else if (parsed.type === 'text') {
                console.log('Gateway sending text to gRPC:', parsed.data);
                call.write({ text_input: parsed.data });
                return;
            }
        } catch (e) {
            // Not JSON, assume audio chunk
        }

        // If we are here, it's likely binary audio
        call.write({ audio_chunk: message });
    });

    ws.on('close', () => {
        call.end();
    });
}
