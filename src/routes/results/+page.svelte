<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/stores/session';
	
	// Function to start a new session
	function startNewSession() {
		// Create a new session
		sessionStore.startNewSession();
		
		// Get the first word from the new session
		const firstWord = sessionStore.getCurrentWord();
		
		// Go to the first word
		goto(`/${firstWord}`);
	}
	
	onMount(() => {
		// If the session is not complete, redirect to the current word
		if (!sessionStore.isSessionComplete()) {
			const currentWord = sessionStore.getCurrentWord();
			goto(`/${currentWord}`);
		} else {
			// If the session is complete and user refreshes the page,
			// make sure a new session is ready to start
			sessionStore.startNewSession();
		}
	});
</script>

<main class="p-8">
	<div class="flex flex-col items-center gap-6">
		<h1 class="text-5xl font-bold text-indigo-600">Session Complete!</h1>
		
		<div class="mt-6 text-center">
			<p class="mb-4 text-xl">Congratulations! You have completed all words in this session.</p>
			
			<button
				on:click={startNewSession}
				class="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-xl font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Start New Session
			</button>
		</div>
	</div>
</main> 