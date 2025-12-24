
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { prompt } = await req.json();

    const result = streamText({
        model: openai('gpt-4o'),
        system: 'You are a professional AI writing assistant for a tech blog. Complete the user\'s sentence or paragraph in a knowledgeable, engaging, and "Digital Architect" tone. Keep it concise.',
        prompt,
    });

    return result.toTextStreamResponse();
}
