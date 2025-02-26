<script lang="ts">
	type KeyCapSize = 'sm' | 'md' | 'lg';

	let { key = '', size = 'md' } = $props<{
		key: string;
		size?: KeyCapSize;
	}>();

	// Map special keys to their display names
	const keyDisplayMap: Record<string, string> = {
		' ': '⎵',
		Enter: '⏎',
		ArrowUp: '↑',
		ArrowDown: '↓',
		ArrowLeft: '←',
		ArrowRight: '→',
		Backspace: '⌫',
		Tab: '⇥',
		Escape: 'Esc',
		Control: 'Ctrl',
		Meta: '⌘',
		Alt: '⌥',
		Shift: '⇧'
	};

	const displayText = $derived(keyDisplayMap[key] || key.toUpperCase());

	const sizeClasses = $derived(
		{
			sm: 'min-w-[24px] h-[24px] text-xs',
			md: 'min-w-[32px] h-[32px] text-sm',
			lg: 'min-w-[40px] h-[40px] text-base'
		}[size as KeyCapSize]
	);

	const isSpaceBar = $derived(key === ' ');
	const spaceBarClasses = $derived(
		{
			sm: 'w-[64px]',
			md: 'w-[96px]',
			lg: 'w-[128px]'
		}[size as KeyCapSize]
	);
</script>

<div
	class="inline-flex items-center justify-center rounded-md border border-gray-300
         bg-gray-100 px-2 font-mono shadow-sm transition-colors
         select-none hover:bg-gray-200 {sizeClasses}
         {isSpaceBar ? spaceBarClasses : ''}"
	role="img"
	aria-label="{key === ' ' ? 'Space' : key} key"
>
	{displayText}
</div>
