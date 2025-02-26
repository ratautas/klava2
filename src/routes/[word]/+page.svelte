<script lang="ts">
	import KeyCap from '$lib/components/KeyCap.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	// Get the word from the route data
	const word = data.word?.toUpperCase() || '';

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ') {
			event.preventDefault();
			goto(`/${word.toLowerCase()}/input`);
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<main class="mx-auto max-w-3xl p-8">
	<div class="word-practice rounded-lg border bg-white p-6 shadow-sm">
		<div class="flex flex-col items-center gap-4">
			<h3 class="text-4xl font-bold">{word}</h3>
			<div class="mt-2 text-center">
				<KeyCap key=" " size="lg" />
				<p class="mt-1 text-sm text-gray-600">Press Space to continue</p>
			</div>
			<a href="/" class="mt-4 text-sm text-blue-600 hover:underline">Back to word list</a>
		</div>
	</div>
</main>

<style>
	.word-practice {
		max-width: 500px;
		margin: 0 auto;
	}
</style>
