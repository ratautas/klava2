<script lang="ts">
	import KeyCap from '$lib/components/KeyCap.svelte';
	import ProgressBullets from '$lib/components/ProgressBullets.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { playAudio, unlockAudioPlayback } from '$lib/services/tts';
	import { sessionStore } from '$lib/stores/session';
	import { audioDB } from '$lib/services/audioDB';
	import { settingsStore } from '$lib/stores/settings';
	import { get } from 'svelte/store';

	const { data } = $props<{ data: import('./$types').PageData }>();
	const { word } = data;

	// Check if this is the current word in the session
	let isCurrentSessionWord = $state(false);
	let sessionStatus = $state<{
		total: number;
		completed: boolean[];
		current: number;
		words: string[];
	}>({ total: 12, completed: [], current: 0, words: [] });
	
	// Update session status
	function updateSessionStatus() {
		isCurrentSessionWord = sessionStore.isCurrentWord(word);
		const status = sessionStore.getSessionStatus();
		sessionStatus = {
			total: status.total,
			completed: status.progress,
			current: status.current,
			words: status.words
		};
		
		// If the URL word doesn't match the current word in the session, replace it
		if (!isCurrentSessionWord) {
			// Replace the current word in the session with the word from URL
			sessionStore.replaceCurrentWord(word);
			
			// Update the flag after replacement
			isCurrentSessionWord = true;
			
			// Update session status again to reflect changes
			const updatedStatus = sessionStore.getSessionStatus();
			sessionStatus = {
				total: updatedStatus.total,
				completed: updatedStatus.progress,
				current: updatedStatus.current,
				words: updatedStatus.words
			};
		}
	}

	// Track if word has been pronounced
	let hasBeenPronounced = $state(false);
	let isPlaying = $state(false);
	let audioLoading = $state(false);
	let autoplayBlocked = $state(false);

	// Function to pronounce the word using the audio database
	async function pronounceWord() {
		if (isPlaying || audioLoading) return;

		isPlaying = true;
		audioLoading = true;

		try {
			// Use the audioDB to get the audio (either from cache or by fetching it)
			const audioBase64 = await audioDB.fetchAudio(word);

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
			audioLoading = false;
			goto(`/${word.toLowerCase()}/input`);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ') {
			event.preventDefault();

			if (!hasBeenPronounced) {
				// First space press - pronounce the word
				pronounceWord();
			}
		}
	}

	onMount(() => {
		// Update session status when component mounts
		updateSessionStatus();
		
		// Try to unlock audio context
		const initialize = async () => {
			await unlockAudioPlayback();
			
			// Pre-fetch audio for all words in the current session
			if (sessionStatus.words.length > 0) {
				// Get settings to know which words might be used
				const settings = get(settingsStore);
				const availableWords = settings.availableWords || [];
				
				// Start with session words (highest priority)
				const wordsToPrefetch = [...sessionStatus.words];
				
				// Then add some available words (limited to a reasonable amount)
				// This helps pre-cache words the user might encounter in future sessions
				const additionalWords = availableWords
					.filter((w: string) => !wordsToPrefetch.includes(w))
					.slice(0, 20); // Limit to 20 additional words
				
				wordsToPrefetch.push(...additionalWords);
				
				// Pre-fetch all words in parallel
				audioDB.preFetchWordAudio(wordsToPrefetch).catch(console.error);
			}
		};

		initialize().catch(console.error);
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

<main class="p-8">
	<div class="flex flex-col items-center gap-4">
		<h3 class="text-6xl font-bold uppercase">{word}</h3>
		<div class="mt-2 flex flex-col items-center">
			<!-- Pronunciation Button -->
			<button
				onclick={pronounceWord}
				class="mb-12 mt-7 relative inline-flex items-center justify-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200 hover:[animation:pulse_0.3s_ease-in-out]"
				disabled={isPlaying || audioLoading}
				aria-label="Pronounce word"
			>
				{#if isPlaying || audioLoading}
					<!-- Loading spinner -->
					<svg 
						class="h-5 w-5 animate-spin" 
						xmlns="http://www.w3.org/2000/svg" 
						fill="none" 
						viewBox="0 0 24 24"
					>
						<circle 
							class="opacity-25" 
							cx="12" 
							cy="12" 
							r="10" 
							stroke="currentColor" 
							stroke-width="4"
						></circle>
						<path 
							class="opacity-75" 
							fill="currentColor" 
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else}
					<!-- Audio icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>

			{#if !isPlaying && !audioLoading}
				<KeyCap key=" " size="lg" />
			{/if}
		</div>
	</div>
	
	<!-- Session Progress -->
	<div class="mt-8">
		<ProgressBullets 
			total={sessionStatus.total} 
			completed={sessionStatus.completed} 
			current={sessionStatus.current} 
			words={sessionStatus.words}
		/>
	</div>
</main>
