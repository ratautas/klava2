<script lang="ts">
	import KeyCap from '$lib/components/KeyCap.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const { data } = $props<{ data: import('./$types').PageData }>();

	// Get the word from the route data
	const word = data.word?.toUpperCase() || '';

	// Store user inputs
	let inputsValues = $state<string[]>([]);
	let inputRefs = $state<HTMLInputElement[]>([]);
	let currentFocusIndex = $state(0);

	// Track if all inputs match the word letters
	const isComplete = $derived(
		word.toLowerCase() === inputsValues.join('').toLowerCase() &&
			inputsValues.every((input) => input !== '')
	);

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ' && isComplete) {
			event.preventDefault();
			goto(`/${word.toLowerCase()}/complete`);
		}
	}

	function handleInput(index: number, event: Event) {
		const input = event.target as HTMLInputElement;
		inputsValues[index] = input.value;

		// Auto-advance to next input if text was entered
		if (input.value && index < word.length - 1) {
			currentFocusIndex = index + 1;
			setTimeout(() => {
				if (inputRefs[currentFocusIndex]) inputRefs[currentFocusIndex].focus();
			}, 0);
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<main class="mx-auto max-w-3xl p-8">
	<div class="word-practice rounded-lg border bg-white p-6 shadow-sm">
		<div class="flex flex-col items-center gap-4">
			<h3 class="mb-4 text-4xl font-bold">{word}</h3>
			<div class="mb-4 flex gap-4">
				{#each word.split('') as letter, i}
					<div class="letter-input">
						<input
							type="text"
							maxlength="1"
							class="h-16 w-16 rounded-lg border-2 text-center text-2xl font-medium transition-all duration-200 
                    {inputsValues[i]
								? inputsValues[i].toLowerCase() === letter.toLowerCase()
									? 'border-green-500 bg-green-50 shadow-sm shadow-green-200'
									: 'border-red-500 bg-red-50 shadow-sm shadow-red-200'
								: 'border-gray-200 hover:border-gray-300'}"
							value={inputsValues[i]}
							oninput={(e) => handleInput(i, e)}
							bind:this={inputRefs[i]}
						/>
					</div>
				{/each}
			</div>

			{#if isComplete}
				<div class="mt-2">
					<KeyCap key=" " size="lg" />
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	.word-practice {
		max-width: 600px;
		margin: 0 auto;
	}

	.letter-input input {
		transform: translateY(0);
		transition: all 0.2s ease;
	}

	.letter-input input:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25);
		transform: translateY(-2px);
	}
	
	.letter-input {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
