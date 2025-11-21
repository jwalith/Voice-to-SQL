import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { PROTO_PATH } from '@jarvis/protos';
import { handleStream } from './agent';
import dotenv from 'dotenv';

dotenv.config();

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const voiceProto = grpc.loadPackageDefinition(packageDefinition).voice as any;

const server = new grpc.Server();

server.addService(voiceProto.VoiceService.service, {
    StreamAudio: handleStream,
});

const PORT = '0.0.0.0:50051';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Voice Service running at ${PORT}`);
    server.start();
});
