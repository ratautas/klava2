import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { WORD_LIST, getRandomWord, LEVEL_1_WORDS, LEVEL_2_WORDS, LEVEL_3_WORDS, LEVEL_4_WORDS } from './words';
import { getCookie, setCookie } from '$lib/utils/cookies';
import { settingsStore } from './settings';

// Cookie names
const SESSION_COOKIE = 'wordSession';
const USED_WORDS_COOKIE = 'usedWords';

// Type definitions
interface WordSession {
  words: string[];      // List of words in the session
  currentIndex: number; // Current word index (0-based)
  completed: boolean[]; // Track which words have been completed
}

// Initialize session store
function createSessionStore() {
  // Track words that have been used across sessions
  const loadUsedWordsFromCookie = (): string[] => {
    if (!browser) return [];
    
    const usedWordsCookie = getCookie(USED_WORDS_COOKIE);
    if (!usedWordsCookie) return [];
    
    try {
      return JSON.parse(usedWordsCookie);
    } catch (e) {
      console.error('Failed to parse used words cookie:', e);
      return [];
    }
  };
  
  // Used words across sessions
  const usedWords = writable<string[]>(loadUsedWordsFromCookie());
  
  // Save used words to cookie when changed
  if (browser) {
    usedWords.subscribe(value => {
      setCookie(USED_WORDS_COOKIE, JSON.stringify(value));
    });
  }

  // Create a new random session
  const createNewSession = (): WordSession => {
    // Get the configured session length
    const sessionLength = settingsStore.getWordsPerSession();
    // Get the available words from settings
    const availableWords = settingsStore.getAvailableWords();
    // Get the selected level
    const selectedLevel = settingsStore.getSelectedLevel() || 1;
    
    // Filter available words based on level
    let levelFilteredWords: string[] = [];
    
    // Apply level filtering based on word length
    switch (selectedLevel) {
      case 1: // 3-4 letter words
        levelFilteredWords = availableWords.filter(word => word.length >= 3 && word.length <= 4);
        break;
      case 2: // 5-6 letter words
        levelFilteredWords = availableWords.filter(word => word.length >= 5 && word.length <= 6);
        break;
      case 3: // 6-7 letter words
        levelFilteredWords = availableWords.filter(word => word.length >= 6 && word.length <= 7);
        break;
      case 4: // 7-8 letter words
        levelFilteredWords = availableWords.filter(word => word.length >= 7 && word.length <= 8);
        break;
      default:
        levelFilteredWords = availableWords;
    }
    
    // If no words match the level criteria, fall back to level-specific word lists
    if (levelFilteredWords.length === 0) {
      switch (selectedLevel) {
        case 1:
          levelFilteredWords = LEVEL_1_WORDS.map(word => word.toLowerCase());
          break;
        case 2:
          levelFilteredWords = LEVEL_2_WORDS.map(word => word.toLowerCase());
          break;
        case 3:
          levelFilteredWords = LEVEL_3_WORDS.map(word => word.toLowerCase());
          break;
        case 4:
          levelFilteredWords = LEVEL_4_WORDS.map(word => word.toLowerCase());
          break;
        default:
          levelFilteredWords = WORD_LIST.map(word => word.toLowerCase());
      }
    }
    
    // Get the current list of previously used words
    const $usedWords = get(usedWords);
    
    // Filter out already used words for this session
    const unusedWords = levelFilteredWords.filter(word => !$usedWords.includes(word));
    
    // If we've used all words, reset the used words list
    if (unusedWords.length === 0) {
      console.log('All words have been used. Resetting used words list.');
      usedWords.set([]);
      // Now all words are available again
      unusedWords.push(...levelFilteredWords);
    }
    
    // Check if we have enough available words
    if (unusedWords.length < sessionLength) {
      console.warn(`Not enough unused words (${unusedWords.length}) for requested session length (${sessionLength}). Using all available unused words.`);
    }
    
    const actualSessionLength = Math.min(sessionLength, unusedWords.length);
    const words: string[] = [];
    
    // Generate unique random words for the session from available words
    while (words.length < actualSessionLength && words.length < unusedWords.length) {
      // Get a random word from available words
      const randomIndex = Math.floor(Math.random() * unusedWords.length);
      const word = unusedWords[randomIndex];
      
      // Avoid duplicates within this session
      if (!words.includes(word)) {
        words.push(word);
        // Add to the global used words list
        usedWords.update(list => [...list, word]);
      }
    }
    
    return {
      words,
      currentIndex: 0,
      completed: Array(words.length).fill(false)
    };
  };

  // Try to load from cookie in browser environment
  const loadSessionFromCookie = (): WordSession | null => {
    if (!browser) return null;
    
    const sessionCookie = getCookie(SESSION_COOKIE);
    if (!sessionCookie) return null;
    
    try {
      return JSON.parse(sessionCookie);
    } catch (e) {
      console.error('Failed to parse session cookie:', e);
      return null;
    }
  };

  const session = writable<WordSession>(loadSessionFromCookie() || createNewSession());

  // Subscribe and save to cookie when changes occur in browser
  if (browser) {
    session.subscribe(value => {
      setCookie(SESSION_COOKIE, JSON.stringify(value));
    });
  }

  return {
    subscribe: session.subscribe,
    
    // Get the current word
    getCurrentWord: () => {
      const $session = get(session);
      return $session.words[$session.currentIndex];
    },
    
    // Check if a word is the current word in the session
    isCurrentWord: (word: string) => {
      const $session = get(session);
      return $session.words[$session.currentIndex] === word.toLowerCase();
    },
    
    // Mark the current word as completed and move to the next
    completeCurrentWord: () => {
      session.update(s => {
        // Mark current word as completed
        s.completed[s.currentIndex] = true;
        
        // Move to next word if not at the end
        if (s.currentIndex < s.words.length - 1) {
          s.currentIndex += 1;
        }
        
        return s;
      });
    },
    
    // Get the next word in the session
    getNextWord: () => {
      const $session = get(session);
      const nextIndex = Math.min($session.currentIndex + 1, $session.words.length - 1);
      return $session.words[nextIndex];
    },
    
    // Check if the session is complete (all words done)
    isSessionComplete: () => {
      const $session = get(session);
      return $session.completed.every(Boolean);
    },
    
    // Start a new session
    startNewSession: () => {
      session.set(createNewSession());
    },
    
    // Get the session status for progress display
    getSessionStatus: () => {
      const $session = get(session);
      return {
        total: $session.words.length,
        completed: $session.completed.filter(Boolean).length,
        current: $session.currentIndex,
        words: $session.words,
        progress: $session.completed
      };
    },
    
    // Reset the used words list
    resetUsedWords: () => {
      usedWords.set([]);
    },
    
    // Get the number of used words
    getUsedWordsCount: () => {
      return get(usedWords).length;
    },
    
    // Replace the current word in the session with a different word
    replaceCurrentWord: (newWord: string) => {
      session.update(s => {
        // Make sure the word is lowercase for consistency
        const wordLowerCase = newWord.toLowerCase();
        
        // Only replace if the word is different from the current one
        if (s.words[s.currentIndex] !== wordLowerCase) {
          // Replace the current word with the new one
          s.words[s.currentIndex] = wordLowerCase;
          
          // Make sure it's not marked as completed if it was just replaced
          s.completed[s.currentIndex] = false;
          
          // Add to used words list (if not already there)
          const $usedWords = get(usedWords);
          if (!$usedWords.includes(wordLowerCase)) {
            usedWords.update(list => [...list, wordLowerCase]);
          }
        }
        return s;
      });
    }
  };
}

export const sessionStore = createSessionStore(); 