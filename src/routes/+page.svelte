<!-- +page.svelte -->
<script lang="ts">
    import KeyCap from '$lib/components/KeyCap.svelte';
    import { WORD_LIST } from '$lib/stores/words';
    // Client-side redirection logic removed
</script>

<main class="p-8 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-center">Word Practice</h1>
    
    <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {#each WORD_LIST as word}
            <a 
                href="/words/{word.toLowerCase()}" 
                class="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            >
                <h2 class="text-xl font-bold mb-2">{word}</h2>
                <p class="text-gray-600 text-sm">Click to practice this word</p>
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
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
</style>
