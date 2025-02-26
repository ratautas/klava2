<script lang="ts">
	import KeyCap from '$lib/components/KeyCap.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props<{ data: import('./$types').PageData }>();
	const { word } = data;

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ') {
			event.preventDefault();
			goto(`/${word.toLowerCase()}/input`);
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<main class="p-8">
	<div class="flex flex-col items-center gap-4">
		<h3 class="text-4xl font-bold uppercase">{word}</h3>
		<div class="mt-2 text-center">
			<KeyCap key=" " size="lg" />
		</div>
	</div>
</main>
