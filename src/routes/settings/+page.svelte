<script lang="ts">
	import { goto } from '$app/navigation';
	import { settingsStore } from '$lib/stores/settings';
	import { sessionStore } from '$lib/stores/session';
	import { WORD_LIST } from '$lib/stores/words';

	// Current settings
	let wordsPerSession = $state(settingsStore.getWordsPerSession());
	let availableWords = $state(settingsStore.getAvailableWords());
	
	// Derived sorted words (to avoid sorting in the template)
	let sortedWords = $derived(
		[...availableWords].sort((a, b) => a.localeCompare(b))
	);
	
	// Min/max constraints for words per session
	const minWordsPerSession = 5;
	const maxWordsPerSession = Math.min(50, 100);
	
	// New word input
	let newWordInput = $state('');
	
	// Add a new word
	function addNewWord() {
		if (!newWordInput.trim()) return;
		
		const lowerWord = newWordInput.trim().toLowerCase();
		
		// Check if word already exists
		if (availableWords.includes(lowerWord)) {
			alert('This word already exists in your list.');
			return;
		}
		
		// Add to available words
		availableWords = [...availableWords, lowerWord];
		
		// Clear input
		newWordInput = '';
	}
	
	// Delete a word
	function deleteWord(word: string) {
		// Make sure we don't delete all words
		if (availableWords.length <= 1) {
			alert('You must have at least one word available.');
			return;
		}
		
		// Remove the word
		availableWords = availableWords.filter(w => w !== word);
	}
	
	// Update a word
	function updateWord(oldWord: string, newValue: string) {
		if (!newValue.trim()) {
			alert('Word cannot be empty.');
			return oldWord;
		}
		
		const lowerWord = newValue.trim().toLowerCase();
		
		// Check if new name already exists (except for the current word)
		if (lowerWord !== oldWord && availableWords.includes(lowerWord)) {
			alert('A word with this name already exists.');
			return oldWord;
		}
		
		// Update the word
		availableWords = availableWords.map(w => 
			w === oldWord ? lowerWord : w
		);
		
		return lowerWord;
	}
	
	// Handle input change for a word
	function handleWordChange(event: Event, oldWord: string) {
		const input = event.target as HTMLInputElement;
		if (!input) return;
		
		const newValue = input.value;
		const updatedWord = updateWord(oldWord, newValue);
		
		// If the word was rejected, reset to original
		if (updatedWord !== newValue.trim().toLowerCase()) {
			input.value = updatedWord;
		}
	}
	
	// Handle input blur when Enter is pressed
	function handleEnterKey(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			const input = event.target as HTMLInputElement;
			if (input) {
				input.blur();
			}
		}
	}
	
	// Handle saving settings
	function saveSettings() {
		// Update settings store
		settingsStore.setWordsPerSession(wordsPerSession);
		settingsStore.setAvailableWords(availableWords);
		
		// Start a new session with the updated settings
		sessionStore.startNewSession();
		
		// Redirect to home page
		goto('/');
	}
	
	// Handle cancellation
	function cancel() {
		goto('/');
	}
  
	// Prevent form submission
	function preventSubmit(event: Event) {
		event.preventDefault();
		return false;
	}
	
	// Validate words per session input
	function validateWordsPerSession() {
		if (isNaN(wordsPerSession) || wordsPerSession < minWordsPerSession) {
			wordsPerSession = minWordsPerSession;
		} else if (wordsPerSession > maxWordsPerSession) {
			wordsPerSession = maxWordsPerSession;
		}
		
		// Ensure integer
		wordsPerSession = Math.floor(wordsPerSession);
	}
</script>

<main class="p-8">
	<div class="mx-auto max-w-2xl">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold">Settings</h1>
			<p class="mt-2 text-gray-600">Customize your learning experience</p>
		</div>

		<div class="rounded-lg bg-white p-6 shadow-md">
			<form onsubmit={preventSubmit}>
				<div class="mb-6">
					<h2 class="mb-4 text-xl font-semibold">Session Configuration</h2>
					
					<div class="mb-4">
						<label for="wordsPerSession" class="mb-2 block font-medium text-gray-700">
							Words per session
						</label>
						<div class="flex items-center gap-4">
							<input
								type="range"
								id="wordsPerSession"
								min={minWordsPerSession}
								max={maxWordsPerSession}
								bind:value={wordsPerSession}
								class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
							/>
							<input 
								type="number" 
								bind:value={wordsPerSession}
								min={minWordsPerSession}
								max={maxWordsPerSession}
								onblur={validateWordsPerSession}
								class="w-20 rounded-md border border-gray-300 px-2 py-1 text-center"
							/>
						</div>
						<p class="mt-1 text-sm text-gray-500">
							Choose how many words you want to practice in each session (between {minWordsPerSession} and {maxWordsPerSession})
						</p>
					</div>

					<div class="mt-6 flex justify-between border-t border-gray-200 pt-4">
						<p class="text-sm text-gray-500">
							Available words: {availableWords.length}
						</p>
					</div>
				</div>
				
				<!-- Available Words Management -->
				<div class="mb-6">
					<h2 class="mb-4 text-xl font-semibold">Manage Words</h2>
					<p class="mb-4 text-sm text-gray-600">
						Add, edit, or remove words for your practice sessions.
					</p>
					
					<!-- Add New Word -->
					<div class="mb-4 flex gap-2">
						<input
							type="text"
							placeholder="Add new word..."
							bind:value={newWordInput}
							class="flex-1 rounded-md border border-gray-300 px-3 py-2"
							onkeydown={(e) => e.key === 'Enter' && addNewWord()}
						/>
						<button
							type="button"
							onclick={addNewWord}
							class="rounded-md bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
						>
							Add Word
						</button>
					</div>
					
					<!-- Words List -->
					<div class="mt-4 max-h-80 overflow-y-auto border border-gray-200 p-2 rounded-md">
						{#if availableWords.length === 0}
							<p class="p-4 text-center text-gray-500">
								No words available. Add some words above.
							</p>
						{:else}
							<ul class="divide-y divide-gray-200">
								{#each sortedWords as word}
									<li class="py-2">
										<div class="flex items-center gap-2">
											<input
												type="text"
												value={word}
												class="flex-1 rounded-md border border-gray-300 px-3 py-1 uppercase"
												onblur={(e) => handleWordChange(e, word)}
												onkeydown={handleEnterKey}
											/>
											<button
												type="button"
												onclick={() => deleteWord(word)}
												class="text-red-400 hover:text-red-600 p-1"
												aria-label="Delete word"
											>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
													<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
												</svg>
											</button>
										</div>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>

				<div class="flex justify-end gap-4">
					<button
						type="button"
						onclick={cancel}
						class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onclick={saveSettings}
						class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
					>
						Save Settings
					</button>
				</div>
			</form>
		</div>
	</div>
</main> 