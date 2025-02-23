<!-- LetterInput.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { LetterState } from '../types';

    const props = $props<{
        state: LetterState;
        index: number;
    }>();

    const dispatch = createEventDispatcher();
    let inputElement: HTMLInputElement;

    $effect(() => {
        if (props.state.isFocused && inputElement) {
            inputElement.focus();
            inputElement.select();
        }
        // Clear input when state is reset
        if (props.state.isCorrect === null && inputElement) {
            inputElement.value = '';
        }
    });

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value.toUpperCase();
        
        if (value.length > 0) {
            dispatch('letterInput', {
                index: props.index,
                value: value[0]
            });
            
            // Clear any additional characters
            input.value = value[0];
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Backspace' && (event.target as HTMLInputElement).value === '') {
            dispatch('backspace', { index: props.index });
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault(); // Prevent cursor movement
            dispatch('navigate', { direction: 'left', index: props.index });
        } else if (event.key === 'ArrowRight') {
            event.preventDefault(); // Prevent cursor movement
            dispatch('navigate', { direction: 'right', index: props.index });
        }
    }
</script>

<input
    bind:this={inputElement}
    type="text"
    maxlength="1"
    class="letter-input {props.state.isCorrect === true ? 'correct' : ''} {props.state.isCorrect === false ? 'incorrect' : ''}"
    oninput={handleInput}
    onkeydown={handleKeydown}
    aria-label="Letter input {props.index + 1}"
/>

<style>
    input {
        caret-color: var(--color-focus);
    }
</style> 