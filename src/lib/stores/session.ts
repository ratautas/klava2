import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { WORD_LIST, getRandomWord } from './words';

const SESSION_STORAGE_KEY = 'wordSession';
const SESSION_LENGTH = 12;

// Type definitions
interface WordSession {
  words: string[];      // List of words in the session
  currentIndex: number; // Current word index (0-based)
  completed: boolean[]; // Track which words have been completed
}

// Initialize session store
function createSessionStore() {
  // Create a new random session
  const createNewSession = (): WordSession => {
    const words: string[] = [];
    
    // Generate unique random words for the session
    while (words.length < SESSION_LENGTH) {
      const word = getRandomWord();
      // Avoid duplicates
      if (!words.includes(word)) {
        words.push(word);
      }
    }
    
    return {
      words,
      currentIndex: 0,
      completed: Array(SESSION_LENGTH).fill(false)
    };
  };

  // Try to load from localStorage in browser environment
  const initialSession = browser 
    ? JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || 'null') 
    : null;

  const session = writable<WordSession>(initialSession || createNewSession());

  // Subscribe and save to localStorage when changes occur in browser
  if (browser) {
    session.subscribe(value => {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(value));
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
        if (s.currentIndex < SESSION_LENGTH - 1) {
          s.currentIndex += 1;
        }
        
        return s;
      });
    },
    
    // Get the next word in the session
    getNextWord: () => {
      const $session = get(session);
      const nextIndex = Math.min($session.currentIndex + 1, SESSION_LENGTH - 1);
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
        total: SESSION_LENGTH,
        completed: $session.completed.filter(Boolean).length,
        current: $session.currentIndex,
        words: $session.words,
        progress: $session.completed
      };
    }
  };
}

export const sessionStore = createSessionStore(); 