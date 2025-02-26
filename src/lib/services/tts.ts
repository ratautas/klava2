interface TTSResponse {
    audioAsString: string;
}

// Flag to track if we've attempted to unlock audio
let audioContextUnlocked = false;

// Function to try to unlock audio playback on browsers
export async function unlockAudioPlayback(): Promise<boolean> {
    if (audioContextUnlocked) return true;
    
    try {
        // Create a silent audio clip
        const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASAthX9F");
        silentAudio.volume = 0.01; // Nearly silent
        
        // Attempt to play it
        await silentAudio.play();
        
        // If we get here, audio playback is unlocked
        audioContextUnlocked = true;
        return true;
    } catch (error) {
        console.warn("Audio context could not be unlocked automatically:", error);
        return false;
    }
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
            
            // Add event listeners before attempting to play
            audio.addEventListener('ended', () => resolve());
            audio.addEventListener('error', (e) => reject(e));
            
            // Attempt to play with better error handling
            const playPromise = audio.play();
            
            // Modern browsers return a promise from play()
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Auto-play was prevented
                    console.warn('Audio playback was prevented by the browser:', error);
                    
                    // Set up a one-time click handler for the document to enable audio
                    const unlockAudio = () => {
                        audio.play()
                            .then(() => {
                                // Successfully playing after user interaction
                                document.removeEventListener('click', unlockAudio);
                                document.removeEventListener('keydown', unlockAudio);
                            })
                            .catch(e => reject(e));
                    };
                    
                    // Listen for user interaction to unlock audio
                    document.addEventListener('click', unlockAudio, { once: true });
                    document.addEventListener('keydown', unlockAudio, { once: true });
                    
                    // If this function is called within an existing user interaction handler,
                    // inform the caller about the issue but don't reject
                    reject(new Error('Audio playback requires user interaction first'));
                });
            }
        } catch (error) {
            reject(error);
        }
    });
} 