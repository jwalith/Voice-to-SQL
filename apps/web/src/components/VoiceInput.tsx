import React from 'react';

interface Props {
    isListening: boolean;
    onStart: () => void;
    onStop: () => void;
}

export const VoiceInput: React.FC<Props> = ({ isListening, onStart, onStop }) => {
    return (
        <button
            onClick={isListening ? onStop : onStart}
            style={{
                padding: '15px 30px',
                fontSize: '18px',
                cursor: 'pointer',
                backgroundColor: isListening ? '#ff4444' : '#4444ff',
                color: 'white',
                border: 'none',
                borderRadius: '50px'
            }}
        >
            {isListening ? '🛑 Stop Listening' : '🎤 Speak to Jarvis'}
        </button>
    );
};
