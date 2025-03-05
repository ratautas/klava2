<script lang="ts">
	import KeyCap from '$lib/components/KeyCap.svelte';
	import ProgressBullets from '$lib/components/ProgressBullets.svelte';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { sessionStore } from '$lib/stores/session';
	import { playAudio, unlockAudioPlayback } from '$lib/services/tts';
	import { audioDB } from '$lib/services/audioDB';

	// Get the word from the route data
	const { data } = $props<{ data: import('./$types').PageData }>();
	const { word } = data;

	// Get the next word from the session
	const nextWord = $derived(sessionStore.getNextWord());

	// Session tracking
	let sessionStatus = $state<{
		total: number;
		completed: boolean[];
		current: number;
		words: string[];
	}>({ total: 12, completed: [], current: 0, words: [] });

	// Update session status
	function updateSessionStatus() {
		const status = sessionStore.getSessionStatus();
		sessionStatus = {
			total: status.total,
			completed: status.progress,
			current: status.current,
			words: status.words
		};
	}

	// Store user inputs
	let inputsValues = $state<string[]>([]);
	let inputRefs = $state<HTMLInputElement[]>([]);

	// Track if all inputs match the word letters
	const isComplete = $derived(word === inputsValues.join('').toLowerCase());
	
	// Track if the word has been pronounced after completion
	let hasPronouncedCompletion = $state(false);
	
	// Watch for isComplete changes and pronounce the word when it becomes true
	$effect(() => {
		if (isComplete && !hasPronouncedCompletion) {
			pronounceWord();
			hasPronouncedCompletion = true;
		}
	});
	
	// Function to pronounce the word
	async function pronounceWord() {
		try {
			// Unlock audio context first (important for mobile browsers)
			await unlockAudioPlayback();
			
			// Get the audio for the word from cache or API
			const audioData = await audioDB.fetchAudio(word);
			
			// Play the audio
			await playAudio(audioData);
		} catch (error) {
			console.error('Error pronouncing word:', error);
		}
	}

	// Check if this is the last word in the session
	const isLastWord = $derived(sessionStatus.current === sessionStatus.total - 1);

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ' && isComplete) {
			event.preventDefault();
			// Mark current word as completed in the session
			sessionStore.completeCurrentWord();
			
			// If this is the last word, go to the results page
			if (isLastWord) {
				goto('/results');
			} else {
				// Otherwise, go to the next word
				goto(`/${nextWord}`);
			}
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			focusPreviousInput();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			focusNextInput();
		}
	}

	function focusNextInput() {
		const currentFocusIndex = inputRefs.findIndex((input) => document.activeElement === input);
		if (currentFocusIndex >= 0 && currentFocusIndex < inputRefs.length - 1) {
			inputRefs[currentFocusIndex + 1].focus();
			inputRefs[currentFocusIndex + 1].select();
		}
	}

	function focusPreviousInput() {
		const currentFocusIndex = inputRefs.findIndex((input) => document.activeElement === input);
		if (currentFocusIndex > 0) {
			inputRefs[currentFocusIndex - 1].focus();
			inputRefs[currentFocusIndex - 1].select();
		}
	}

	async function handleInput(index: number) {
		const inputValue = inputsValues[index]?.toLowerCase();
		const expectedValue = word[index];
		if (inputValue === expectedValue) {
			inputRefs[index + 1]?.focus();
			await tick();
			inputRefs[index + 1]?.select();
		} else {
			inputRefs[index].select();
		}
	}

	function isLetterCorrect(index: number) {
		return inputsValues[index]?.toLowerCase() === word[index].toLowerCase();
	}

	onMount(() => {
		// Update session status
		updateSessionStatus();

		const [firstInput] = inputRefs;
		if (firstInput) firstInput.focus();
		
		// Pre-fetch the audio for the current word
		unlockAudioPlayback()
			.then(() => audioDB.fetchAudio(word))
			.catch(error => console.error('Error pre-fetching word audio:', error));
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

<main class="p-8">
	<div class="flex flex-col items-center gap-4">
		<h3 class="mb-4 text-6xl font-bold uppercase" class:text-green-500={isComplete}>
			{word}
		</h3>
		<div class="mb-4 flex gap-4">
			{#each word.split('') as letter, i}
				<div class="flex items-center justify-center uppercase">
					<input
						type="text"
						maxlength="1"
						class="h-16 w-16
						translate-y-0 rounded-md border text-center text-6xl
						uppercase transition-all duration-200 ease-in-out
						focus:-translate-y-0.5 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/25
						focus:outline-none"
						oninput={() => handleInput(i)}
						class:border-red-500={!isLetterCorrect(i) && !!inputsValues[i]}
						class:text-red-700={!isLetterCorrect(i) && !!inputsValues[i]}
						bind:value={inputsValues[i]}
						bind:this={inputRefs[i]}
					/>
				</div>
			{/each}
		</div>

		<div class="mt-2 flex items-center justify-center gap-2">
			{#if isComplete}
				<KeyCap key=" " size="lg" />
			{:else}
				<button
					onclick={focusPreviousInput}
					class="focus:outline-none"
					aria-label="Previous letter"
				>
					<KeyCap key="ArrowLeft" size="lg" />
				</button>
				<button onclick={focusNextInput} class="focus:outline-none" aria-label="Next letter">
					<KeyCap key="ArrowRight" size="lg" />
				</button>
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
