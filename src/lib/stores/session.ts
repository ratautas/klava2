import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { WORD_LIST, getRandomWord } from './words';
import { getCookie, setCookie } from '$lib/utils/cookies';
import { settingsStore } from './settings';

// Cookie names
const SESSION_COOKIE = 'wordSession';

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
    // Get the configured session length
    const sessionLength = settingsStore.getWordsPerSession();
    // Get the available words from settings
    const availableWords = settingsStore.getAvailableWords();
    
    // Check if we have enough available words
    if (availableWords.length < sessionLength) {
      console.warn(`Not enough available words (${availableWords.length}) for requested session length (${sessionLength}). Using all available words.`);
    }
    
    const actualSessionLength = Math.min(sessionLength, availableWords.length);
    const words: string[] = [];
    
    // Generate unique random words for the session from available words
    while (words.length < actualSessionLength && words.length < availableWords.length) {
      // Get a random word from available words
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const word = availableWords[randomIndex];
      
      // Avoid duplicates
      if (!words.includes(word)) {
        words.push(word);
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
    }
  };
}

export const sessionStore = createSessionStore(); 