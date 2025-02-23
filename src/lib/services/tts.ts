interface TTSResponse {
    audioAsString: string;
}

export async function synthesizeSpeech(text: string): Promise<string> {
    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Failed to synthesize speech');
        }

        const data: TTSResponse = await response.json();
        return data.audioAsString;
    } catch (error) {
        console.error('TTS error:', error);
        throw error;
    }
}

export function playAudio(audioBase64: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
            audio.addEventListener('ended', () => resolve());
            audio.addEventListener('error', (e) => reject(e));
            audio.play();
        } catch (error) {
            reject(error);
        }
    });
} 