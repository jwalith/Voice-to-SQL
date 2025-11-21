import { VoiceInput } from './components/VoiceInput';
import { useAudioStream } from './hooks/useAudioStream';
import './App.css';

function App() {
  const { isConnected, transcript, response, isListening, startListening, stopListening } = useAudioStream();

  return (
    <div className="app">
      <h1>Jarvis Data Analyst</h1>
      <div className="status">
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div className="chat-container">
        <div className="message user">
          <div className="label">You said:</div>
          <div className="content">{transcript || "..."}</div>
        </div>
        <div className="message ai">
          <div className="label">Jarvis replied:</div>
          <div className="content">{response || "..."}</div>
        </div>
      </div>

      <div className="controls">
        <VoiceInput
          isListening={isListening}
          onStart={startListening}
          onStop={stopListening}
        />
      </div>
    </div>
  );
}

export default App;
