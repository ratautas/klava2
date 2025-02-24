<script lang="ts">
  let { key = '', size = 'md' } = $props<{
    key: string;
    size?: 'sm' | 'md' | 'lg';
  }>();

  // Map special keys to their display names
  const keyDisplayMap: Record<string, string> = {
    ' ': '⎵',
    'Enter': '⏎',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Backspace': '⌫',
    'Tab': '⇥',
    'Escape': 'Esc',
    'Control': 'Ctrl',
    'Meta': '⌘',
    'Alt': '⌥',
    'Shift': '⇧'
  };

  const displayText = $derived(keyDisplayMap[key] || key.toUpperCase());

  const sizeClasses = $derived({
    sm: 'min-w-[24px] h-[24px] text-xs',
    md: 'min-w-[32px] h-[32px] text-sm',
    lg: 'min-w-[40px] h-[40px] text-base'
  }[size]);

  const isSpaceBar = $derived(key === ' ');
  const spaceBarClasses = $derived({
    sm: 'w-[64px]',
    md: 'w-[96px]',
    lg: 'w-[128px]'
  }[size]);
</script>

<div 
  class="keycap inline-flex items-center justify-center px-2 rounded-md 
         bg-gray-100 border border-gray-300 font-mono shadow-sm 
         hover:bg-gray-200 transition-colors {sizeClasses}
         {isSpaceBar ? spaceBarClasses : ''}"
  role="img"
  aria-label="{key === ' ' ? 'Space' : key} key"
>
  {displayText}
</div>

<style>
  .keycap {
    user-select: none;
  }
</style> 