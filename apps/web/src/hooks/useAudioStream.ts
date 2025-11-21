import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioStream() {
    const [isConnected, setIsConnected] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [isListening, setIsListening] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4001');
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to Gateway');
            setIsConnected(true);
            ws.send(JSON.stringify({ type: 'setup' }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.text_response) {
                    setResponse(data.text_response);
                    const utterance = new SpeechSynthesisUtterance(data.text_response);
                    window.speechSynthesis.speak(utterance);
                }
            } catch (e) {
                console.error('Error parsing message', e);
            }
        };

        ws.onclose = () => setIsConnected(false);

        // Setup Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                console.log('Recognized:', text);
                // Send to backend
                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({ type: 'text', data: text }));
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            ws.close();
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        } else {
            alert('Speech Recognition not supported in this browser.');
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    return { isConnected, transcript, response, isListening, startListening, stopListening };
}
