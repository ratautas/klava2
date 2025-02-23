<!-- +page.svelte -->
<script lang="ts">
    import Game from '$lib/components/Game.svelte';
</script>

<main class="min-h-screen bg-gray-50">
    <Game />
</main>

<style>
    :global(html) {
        @apply antialiased;
    }
</style>
