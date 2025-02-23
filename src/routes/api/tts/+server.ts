import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { text } = await request.json();

        const response = await fetch('https://sinteze.intelektika.lt/synthesis.service/prod/synthesize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://snekos-sinteze.lt',
                'Referer': 'https://snekos-sinteze.lt/'
            },
            body: JSON.stringify({
                text,
                saveRequest: false,
                outputTextFormat: 'none',
                speed: 1,
                voice: 'vytautas'
            })
        });

        if (!response.ok) {
            return new Response('Failed to synthesize speech', { status: response.status });
        }

        const data = await response.json();
        return json(data);
    } catch (error) {
        console.error('TTS error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}; 