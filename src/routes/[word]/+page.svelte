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
      goto(`/words/${word.toLowerCase()}/input`);
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<main class="p-8 max-w-3xl mx-auto">
  <div class="word-practice p-6 border rounded-lg bg-white shadow-sm">
    <div class="flex flex-col items-center gap-4">
      <h3 class="text-4xl font-bold">{word}</h3>
      <div class="mt-2 text-center">
        <KeyCap key=" " size="lg" />
        <p class="text-sm text-gray-600 mt-1">Press Space to continue</p>
      </div>
      <a href="/" class="mt-4 text-blue-600 hover:underline text-sm">Back to word list</a>
    </div>
  </div>
</main>

<style>
  .word-practice {
    max-width: 500px;
    margin: 0 auto;
  }
</style> 