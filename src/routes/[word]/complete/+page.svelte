<script lang="ts">
	import { page } from '$app/stores';
	import KeyCap from '$lib/components/KeyCap.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { WORD_LIST, getNextWord } from '$lib/stores/words';

	// Get the word from the route params
	const word = $derived($page.params.word?.toUpperCase() || '');

	// Get the next word
	const nextWord = $derived(getNextWord(word));
	const nextWordUppercase = $derived(
		WORD_LIST.find((w) => w.toLowerCase() === nextWord)?.toUpperCase() || ''
	);

	// Track if word has been pronounced
	let hasBeenPronounced = false;
	let isPlaying = false;

	// Function to pronounce the word
	function pronounceWord() {
		if (!window.speechSynthesis) return;

		isPlaying = true;
		const utterance = new SpeechSynthesisUtterance(word);
		utterance.rate = 0.9; // Slightly slower for clarity
		utterance.onend = () => {
			hasBeenPronounced = true;
			isPlaying = false;
		};
		window.speechSynthesis.speak(utterance);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ') {
			event.preventDefault();

			if (!hasBeenPronounced && !isPlaying) {
				// First space press should pronounce the word
				pronounceWord();
			} else {
				// Second space press (after pronunciation) should navigate to next word
				goto(`/words/${nextWord}`);
			}
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);

		// Automatically pronounce the word on load
		setTimeout(pronounceWord, 500);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			// Cancel any ongoing speech when component unmounts
			if (window.speechSynthesis) {
				window.speechSynthesis.cancel();
			}
		};
	});
</script>

<main class="mx-auto max-w-3xl p-8">
	<div class="word-practice rounded-lg border bg-white p-6 shadow-sm">
		<div class="flex flex-col items-center gap-4">
			<h3 class="text-2xl font-bold text-green-600">{word}</h3>
			<p class="font-medium text-green-600">Great job!</p>

			<!-- Pronunciation and Next Step Controls -->
			<div class="mt-2 flex flex-col items-center">
				{#if !hasBeenPronounced}
					<button
						on:click={pronounceWord}
						class="mb-3 flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
						disabled={isPlaying}
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
						{isPlaying ? 'Playing...' : 'Hear pronunciation'}
					</button>

					<KeyCap key=" " size="lg" />
					<p class="mt-1 text-sm text-gray-600">Press Space to hear the word</p>
				{:else}
					<KeyCap key=" " size="lg" />
					<p class="mt-1 text-sm text-gray-600">Press Space for next word ({nextWordUppercase})</p>
				{/if}
			</div>

			<div class="mt-4 flex gap-4">
				<a href="/" class="text-sm text-blue-600 hover:underline">Back to all words</a>
				<a href="/words/{word.toLowerCase()}" class="text-sm text-blue-600 hover:underline"
					>Practice again</a
				>
			</div>
		</div>
	</div>
</main>

<style>
	.word-practice {
		max-width: 500px;
		margin: 0 auto;
	}
</style>
