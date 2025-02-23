<!-- WordDisplay.svelte -->
<script lang="ts">
    const props = $props<{
        word: string;
    }>();
</script>

<div class="word-display" role="heading" aria-level="1">
    {props.word}
</div> 