// List of practice words
export const WORD_LIST = [
  'NAMAS',
  'MAMA',
  'SALA',
];

/**
 * Gets a random word from the word list
 */
export function getRandomWord(): string {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex].toLowerCase();
}

/**
 * Gets the next word in the list after the current word
 */
export function getNextWord(currentWord: string): string {
  const upperCurrentWord = currentWord.toUpperCase();
  const currentIndex = WORD_LIST.findIndex(w => w.toUpperCase() === upperCurrentWord);
  
  if (currentIndex === -1) {
    return getRandomWord();
  }
  
  const nextIndex = (currentIndex + 1) % WORD_LIST.length;
  return WORD_LIST[nextIndex].toLowerCase();
} 