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

// This function remains unchanged to allow direct fetching from the API when needed
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

// Modified to use caching when possible
export async function getAudioForWord(word: string): Promise<string> {
    // This function will be implemented in the component using the audioDB
    // We keep the original synthesizeSpeech function untouched to allow direct API calls when needed
    return synthesizeSpeech(word);
}

export function playAudio(audioBase64: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
            
            audio.onended = () => {
                resolve();
            };
            
            audio.onerror = (error) => {
                reject(new Error('Audio playback error'));
            };
            
            // Try to play and handle autoplay blocking
            audio.play().then(() => {
                // Playing succeeded
            }).catch((error) => {
                // This might be due to autoplay blocking
                if (error.name === "NotAllowedError") {
                    const unlockAudio = () => {
                        audio.play().then(() => {
                            // Clean up the document event listeners after success
                            document.removeEventListener('click', unlockAudio);
                            document.removeEventListener('touchstart', unlockAudio);
                            document.removeEventListener('keydown', unlockAudio);
                        }).catch(reject);
                    };
                    
                    // Add event listeners to unlock audio on user interaction
                    document.addEventListener('click', unlockAudio, { once: true });
                    document.addEventListener('touchstart', unlockAudio, { once: true });
                    document.addEventListener('keydown', unlockAudio, { once: true });
                    
                    reject(new Error('Audio playback requires user interaction'));
                } else {
                    reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
} 