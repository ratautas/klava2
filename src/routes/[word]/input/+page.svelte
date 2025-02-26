<script lang="ts">
	import KeyCap from '$lib/components/KeyCap.svelte';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';

	// Get the word from the route data
	const { data } = $props<{ data: import('./$types').PageData }>();
	const { word } = data;

	// Store user inputs
	let inputsValues = $state<string[]>([]);
	let inputRefs = $state<HTMLInputElement[]>([]);

	// Track if all inputs match the word letters
	const isComplete = $derived(word === inputsValues.join('').toLowerCase());

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ' && isComplete) {
			event.preventDefault();
			goto(`/${word.toLowerCase()}/complete`);
		}
	}

	async function handleInput(index: number) {
		const inputValue = inputsValues[index].toLowerCase();
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
		return inputsValues[index].toLowerCase() === word[index].toLowerCase();
	}

	onMount(() => {
		const [firstInput] = inputRefs;
		if (firstInput) firstInput.focus();
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
						class="
						h-16
						w-16
						translate-y-0 rounded-md border text-center text-6xl
								uppercase transition-all duration-200 ease-in-out
								focus:-translate-y-0.5 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none
								{inputsValues[i]
							? isLetterCorrect(i)
								? 'border-green-500 bg-green-50 text-green-700'
								: 'border-red-500 bg-red-50 text-red-700'
							: 'border-gray-300'}"
						oninput={() => handleInput(i)}
						bind:value={inputsValues[i]}
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
</main>
