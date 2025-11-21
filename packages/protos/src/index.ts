import path from 'path';

export const PROTO_PATH = path.join(__dirname, 'voice.proto');

export interface AudioRequest {
    setup?: Setup;
    audio_chunk?: Buffer;
    text_input?: string;
}

export interface Setup {
    session_id: string;
    user_id: string;
}

export interface AudioResponse {
    audio_chunk?: Buffer;
    transcript?: string;
    text_response?: string;
    tool_call?: string;
}
