<script lang="ts">
	import KeyCap from '$lib/components/KeyCap.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getNextWord } from '$lib/stores/words';
	import { synthesizeSpeech, playAudio, unlockAudioPlayback } from '$lib/services/tts';

	// Get the word from the route data
	const { data } = $props<{ data: import('./$types').PageData }>();
	const { word } = data;

	// Get the next word
	const nextWord = $derived(getNextWord(word));

	// Track if word has been pronounced
	let hasBeenPronounced = $state(false);
	let isPlaying = $state(false);
	let autoplayBlocked = $state(false);

	// Function to pronounce the word using TTS service
	async function pronounceWord() {
		if (isPlaying) return;

		isPlaying = true;

		try {
			// Use the TTS service to convert text to speech
			const audioBase64 = await synthesizeSpeech(word);

			// Try to play the audio and wait for it to complete
			await playAudio(audioBase64);

			// Mark as pronounced once audio is done playing
			hasBeenPronounced = true;
			autoplayBlocked = false;
		} catch (error: any) {
			console.error('Failed to pronounce word:', error);

			// Check if this was due to autoplay blocking
			if (error.message?.includes('user interaction')) {
				autoplayBlocked = true;
				// Don't set hasBeenPronounced to true here, as we still need to play it
			}
		} finally {
			isPlaying = false;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ') {
			event.preventDefault();

			// Second space press (after pronunciation) should navigate to next word
			goto(`/${nextWord}`);
		}
	}

	onMount(() => {
		// Try to unlock audio context and play word
		const initialize = async () => {
			await unlockAudioPlayback();
			// Attempt to pronounce the word automatically after a short delay
			setTimeout(() => pronounceWord(), 500);
		};

		initialize().catch(console.error);
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

<main class="p-8">
	<div class="flex flex-col items-center gap-4">
		<h3 class="text-4xl font-bold text-green-600 uppercase">{word}</h3>

		<!-- Pronunciation and Next Step Controls -->
		<div class="mt-2 flex flex-col items-center">
			<button
				onclick={pronounceWord}
				class="mb-3 flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
				disabled={isPlaying}
				aria-label="Pronounce word"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<KeyCap key=" " size="lg" />
		</div>
	</div>
</main>
