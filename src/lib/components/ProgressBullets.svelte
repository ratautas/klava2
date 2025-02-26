<script lang="ts">
    // Props
    const { 
        total = 12,
        completed = [],
        current = 0, 
        words = []
    } = $props<{
        total?: number;
        completed?: boolean[];
        current?: number;
        words?: string[];
    }>();
</script>

<div class="progress-bullets">
    <div class="bullets-container">
        {#each Array(total) as _, i}
            <div 
                class="bullet-wrapper" 
                title={words[i] ? words[i].toUpperCase() : `Word ${i+1}`}
            >
                <div 
                    class="bullet" 
                    class:completed={completed[i]} 
                    class:current={i === current && !completed[i]}
                >
                    {#if completed[i]}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="checkmark">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .progress-bullets {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }
    
    .bullets-container {
        display: flex;
        gap: 8px;
        justify-content: center;
        max-width: 90%;
        flex-wrap: wrap;
    }
    
    .bullet-wrapper {
        position: relative;
    }
    
    .bullet {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #e5e7eb;
        border: 2px solid #d1d5db;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease-in-out;
    }
    
    .bullet.completed {
        background-color: #10b981;
        border-color: #059669;
        color: white;
    }
    
    .bullet.current {
        background-color: #3b82f6;
        border-color: #2563eb;
        transform: scale(1.2);
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
    }
    
    .checkmark {
        width: 10px;
        height: 10px;
        color: white;
    }
</style> 