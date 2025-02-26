<!-- +page.svelte -->
<script lang="ts">
	import KeyCap from '$lib/components/KeyCap.svelte';
	import { WORD_LIST } from '$lib/stores/words';
	// Client-side redirection logic removed
</script>

<main class="mx-auto max-w-3xl p-8">
	<h1 class="mb-8 text-center text-3xl font-bold">Word Practice</h1>

	<div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
		{#each WORD_LIST as word}
			<a
				href="/words/{word.toLowerCase()}"
				class="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:bg-gray-50"
			>
				<h2 class="mb-2 text-xl font-bold">{word}</h2>
				<p class="text-sm text-gray-600">Click to practice this word</p>
			</a>
		{/each}
	</div>

	<div class="mt-8 text-center text-sm text-gray-500">
		<p>Navigation: Use <KeyCap key=" " size="sm" /> to advance through each step</p>
	</div>
</main>

<style>
	:global(body) {
		background-color: #f9fafb;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}
</style>
