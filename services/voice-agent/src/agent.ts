import 'dotenv/config';
import { AudioRequest, AudioResponse } from '@jarvis/protos';
import * as grpc from '@grpc/grpc-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initDB, tools, executeTool } from './tools';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Using Gemini 2.5 Flash Lite with v1beta API as requested
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", tools: tools as any }, { apiVersion: 'v1beta' });

let chatSession: any;

// Initialize DB on start
initDB();

export function handleStream(call: grpc.ServerDuplexStream<AudioRequest, AudioResponse>) {
    console.log('New gRPC stream connection');

    // Start a new chat session for this stream
    chatSession = model.startChat({
        history: [
            {
                role: "user",
                parts: [{
                    text: `You are a helpful data analyst assistant. You have access to a sales database with the following schema:

Table: sales
Columns:
- id (INTEGER): unique identifier
- item (TEXT): product name (e.g., 'Laptop', 'Mouse', 'Keyboard')
- category (TEXT): product category (e.g., 'electronics', 'food')
- amount (REAL): sale amount in dollars
- date (TEXT): sale date

When users ask about specific products like "laptops" or "mice", query the 'item' column, NOT the 'category' column.
Use LIKE with wildcards for flexible matching, e.g., WHERE item LIKE '%Laptop%'` }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to help with your data analysis. I will query the 'item' column when you ask about specific products." }],
            }
        ],
    });

    call.on('data', async (request: AudioRequest) => {
        console.log('Voice Agent received request:', JSON.stringify(request));

        if (request.setup) {
            console.log('Setup received:', request.setup);
            call.write({ text_response: 'Hello! I am Jarvis. Ask me about sales data.' });
        } else if (request.text_input) {
            console.log('Received text:', request.text_input);
            try {
                const result = await chatSession.sendMessage(request.text_input);
                const response = await result.response;

                // Log the entire response structure to understand what we're getting
                console.log('DEBUG: Full response:', JSON.stringify(response, null, 2));
                console.log('DEBUG: Response candidates:', JSON.stringify(response.candidates, null, 2));

                // Manual function call extraction for newer SDK versions (0.24.1+)
                const parts = response.candidates?.[0]?.content?.parts || [];
                console.log('DEBUG: Raw parts:', JSON.stringify(parts, null, 2));

                const calls = parts.filter((p: any) => p.functionCall).map((p: any) => p.functionCall);
                console.log('DEBUG: Extracted calls:', JSON.stringify(calls, null, 2));

                if (calls && calls.length > 0) {
                    for (const callData of calls) {
                        console.log('Executing tool:', callData.name);
                        console.log('Tool args:', JSON.stringify(callData.args));
                        const toolResult = await executeTool(callData.name, callData.args);
                        console.log('Tool result:', toolResult);

                        // Send tool result back to model
                        const result2 = await chatSession.sendMessage([
                            {
                                functionResponse: {
                                    name: callData.name,
                                    response: { result: toolResult }
                                }
                            }
                        ]);
                        const response2 = await result2.response;
                        const text = response2.text();
                        call.write({ text_response: text });
                    }
                } else {
                    console.log('DEBUG: No function calls found, returning direct text response');
                    const text = response.text();
                    call.write({ text_response: text });
                }
            } catch (e: any) {
                console.error('Error processing text:', JSON.stringify(e, Object.getOwnPropertyNames(e)));
                console.error('Stack:', e.stack);
                call.write({ text_response: `Error: ${e.message || 'Unknown error'}` });
            }
        }
    });

    call.on('end', () => {
        console.log('Stream ended');
    });
}
