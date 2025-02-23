<!-- Game.svelte -->
<script lang="ts">
    import { getWordsByDifficulty } from '../types';
    import type { Difficulty, GameState, LetterState } from '../types';
    import { synthesizeSpeech, playAudio } from '../services/tts';
    import LetterInput from './LetterInput.svelte';
    import WordDisplay from './WordDisplay.svelte';

    let difficulty = $state<Difficulty>('easy');
    let currentWord = $state('');
    let letterStates = $state<LetterState[]>([]);
    let currentIndex = $state(0);
    let isComplete = $state(false);
    let showSuccess = $state(false);
    let isLoading = $state(false);
    let audioContext: AudioContext;

    // Initialize AudioContext on first user interaction
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new AudioContext();
        }
    }

    async function speakWord(word: string) {
        try {
            if (isLoading) return; // Prevent multiple simultaneous requests
            isLoading = true;
            initAudioContext(); // Ensure audio context is initialized
            const audioBase64 = await synthesizeSpeech(word);
            await playAudio(audioBase64);
        } catch (error) {
            console.error('Failed to speak word:', error);
            // Don't throw the error - just log it and continue
        } finally {
            isLoading = false;
        }
    }

    async function initializeGame() {
        const words = getWordsByDifficulty(difficulty);
        currentWord = words[Math.floor(Math.random() * words.length)];
        letterStates = Array.from(currentWord).map((letter, index) => ({
            letter,
            isCorrect: null,
            isFocused: index === 0
        }));
        currentIndex = 0;
        isComplete = false;
        showSuccess = false;
        
        // Don't automatically speak the word on game start
        // Let the user interact first
    }

    async function handleLetterInput(event: CustomEvent<{ index: number; value: string }>) {
        const { index, value } = event.detail;
        const isCorrect = value === currentWord[index];
        
        letterStates[index] = {
            ...letterStates[index],
            isCorrect,
            isFocused: false
        };

        if (isCorrect && index < currentWord.length - 1) {
            letterStates[index + 1].isFocused = true;
            currentIndex = index + 1;
        } else if (isCorrect && index === currentWord.length - 1) {
            // Wait a moment before speaking
            await new Promise(resolve => setTimeout(resolve, 500));
            // Speak the word
            await speakWord(currentWord);
            // Clear all inputs after word is spoken
            letterStates = letterStates.map(state => ({
                ...state,
                isCorrect: null,
                isFocused: false
            }));
            // Start new game after a short delay
            setTimeout(() => {
                initializeGame();
            }, 500);
        }
    }

    function handleBackspace(event: CustomEvent<{ index: number }>) {
        const { index } = event.detail;
        if (index > 0) {
            letterStates[index].isFocused = false;
            letterStates[index - 1].isFocused = true;
            letterStates[index - 1].isCorrect = null;
            currentIndex = index - 1;
        }
    }

    function handleNavigation(event: CustomEvent<{ direction: 'left' | 'right'; index: number }>) {
        const { direction, index } = event.detail;
        const totalLetters = letterStates.length;
        
        // Calculate new index with wrapping
        let newIndex;
        if (direction === 'left') {
            newIndex = index > 0 ? index - 1 : totalLetters - 1;
        } else {
            newIndex = index < totalLetters - 1 ? index + 1 : 0;
        }

        // Update focus states
        letterStates = letterStates.map((state, i) => ({
            ...state,
            isFocused: i === newIndex
        }));
        currentIndex = newIndex;
    }

    function handleDifficultyChange(event: Event) {
        difficulty = (event.target as HTMLSelectElement).value as Difficulty;
        initializeGame();
    }

    // Initialize game on mount
    $effect(() => {
        initializeGame();
    });
</script>

<div class="game-container">
    <select
        class="difficulty-selector"
        value={difficulty}
        onchange={(event) => handleDifficultyChange(event)}
        aria-label="Select difficulty level"
    >
        <option value="easy">Easy (4 letters)</option>
        <option value="medium">Medium (5 letters)</option>
        <option value="hard">Hard (6 letters)</option>
    </select>

    <div class="word-container">
        <WordDisplay word={currentWord} />
    </div>

    <div class="flex justify-center items-center space-x-4">
        {#each letterStates as state, index}
            <LetterInput
                {state}
                {index}
                on:letterInput={handleLetterInput}
                on:backspace={handleBackspace}
                on:navigate={handleNavigation}
            />
        {/each}
    </div>

    {#if showSuccess}
        <div class="success-message" role="dialog" aria-label="Success message">
            <div class="success-content">
                <h2 class="text-2xl font-bold mb-4">Puiku! 🎉</h2>
                <p class="mb-4">Tu teisingai parašei žodį!</p>
                <button
                    class="bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    onclick={initializeGame}
                >
                    Žaisti dar kartą
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .word-container {
        @apply flex flex-col items-center;
    }
</style> 