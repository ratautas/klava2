// List of practice words
export const WORD_LIST = [
  'NAMAS',
  'MAMA',
  'SALA',
  'DAINA',
  'DIENA',
  'DUONA',
  'GERAS',
  'GALAS',
  'KAINA',
  'KAVA',
  'KALBA',
  'KOJA',
  'LOVA',
  'LIETUS',
  'LANGAS',
  'MOLIS',
  'MEDIS',
  'MIEGAS',
  'NAKTIS',
  'PIENAS',
  'PUODE',
  'RANKA',
  'RATAS',
  'RYTAS',
  'SUOLAS',
  'STALAS',
  'SAPNAS',
  'UGNIS',
  'VANDUO',
  'VAIKAS',
  'AKIS',
  'AKMUO',
  'BATAS',
  'BURNA',
  'DARBAS',
  'LAIVAS',
  'LAPAS',
  'ORAS',
  'PLAUKAS',
  'SIENA',
  'SNIEGAS',
  'TILTAS',
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