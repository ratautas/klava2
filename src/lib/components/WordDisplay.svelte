<!-- WordDisplay.svelte -->
<script lang="ts">
    const props = $props<{
        word: string;
    }>();
</script>

<div class="text-6xl font-bold text-gray-800 mb-8" role="heading" aria-level="1">
    {props.word}
</div> 