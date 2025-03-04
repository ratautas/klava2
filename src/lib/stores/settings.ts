import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { getCookie, setCookie } from '$lib/utils/cookies';
import { WORD_LIST } from './words';

// Cookie names
const WORDS_PER_SESSION_COOKIE = 'wordsPerSession';
const AVAILABLE_WORDS_COOKIE = 'availableWords';
const SELECTED_LEVEL_COOKIE = 'selectedLevel';
const DEFAULT_WORDS_PER_SESSION = 12;
const DEFAULT_LEVEL = 1;

// Interface for user settings
interface UserSettings {
  wordsPerSession: number;
  availableWords: string[];
  selectedLevel: number;
}

// Initialize settings store
function createSettingsStore() {
  // Load initial settings from cookies or use defaults
  const getInitialSettings = (): UserSettings => {
    if (!browser) {
      return { 
        wordsPerSession: DEFAULT_WORDS_PER_SESSION,
        availableWords: [...WORD_LIST.map(w => w.toLowerCase())],
        selectedLevel: DEFAULT_LEVEL
      };
    }
    
    // Get words per session from cookie or use default
    const wordsPerSessionCookie = getCookie(WORDS_PER_SESSION_COOKIE);
    const wordsPerSession = wordsPerSessionCookie 
      ? parseInt(wordsPerSessionCookie, 10) 
      : DEFAULT_WORDS_PER_SESSION;
    
    // Get available words from cookie or use all words
    const availableWordsCookie = getCookie(AVAILABLE_WORDS_COOKIE);
    const availableWords = availableWordsCookie
      ? JSON.parse(availableWordsCookie)
      : [...WORD_LIST.map(w => w.toLowerCase())];
    
    // Get selected level from cookie or use default
    const selectedLevelCookie = getCookie(SELECTED_LEVEL_COOKIE);
    const selectedLevel = selectedLevelCookie
      ? parseInt(selectedLevelCookie, 10)
      : DEFAULT_LEVEL;
    
    return { 
      wordsPerSession,
      availableWords,
      selectedLevel
    };
  };

  const settings = writable<UserSettings>(getInitialSettings());

  // Subscribe to changes and update cookies
  if (browser) {
    settings.subscribe(value => {
      setCookie(WORDS_PER_SESSION_COOKIE, value.wordsPerSession.toString());
      setCookie(AVAILABLE_WORDS_COOKIE, JSON.stringify(value.availableWords));
      setCookie(SELECTED_LEVEL_COOKIE, value.selectedLevel.toString());
    });
  }

  return {
    subscribe: settings.subscribe,
    
    // Update words per session
    setWordsPerSession: (count: number) => {
      settings.update(s => ({ ...s, wordsPerSession: count }));
    },
    
    // Get current number of words per session
    getWordsPerSession: () => {
      return get(settings).wordsPerSession;
    },
    
    // Update available words
    setAvailableWords: (words: string[]) => {
      settings.update(s => ({ ...s, availableWords: words }));
    },
    
    // Get available words
    getAvailableWords: () => {
      return get(settings).availableWords;
    },
    
    // Set selected level
    setSelectedLevel: (level: number) => {
      settings.update(s => ({ ...s, selectedLevel: level }));
    },
    
    // Get selected level
    getSelectedLevel: () => {
      return get(settings).selectedLevel;
    },
    
    // Add a word to available words
    addAvailableWord: (word: string) => {
      settings.update(s => {
        const lowerWord = word.toLowerCase();
        if (!s.availableWords.includes(lowerWord)) {
          return { ...s, availableWords: [...s.availableWords, lowerWord] };
        }
        return s;
      });
    },
    
    // Remove a word from available words
    removeAvailableWord: (word: string) => {
      settings.update(s => {
        const lowerWord = word.toLowerCase();
        return { 
          ...s, 
          availableWords: s.availableWords.filter(w => w !== lowerWord)
        };
      });
    },
    
    // Toggle word availability
    toggleWordAvailability: (word: string) => {
      settings.update(s => {
        const lowerWord = word.toLowerCase();
        if (s.availableWords.includes(lowerWord)) {
          return { 
            ...s, 
            availableWords: s.availableWords.filter(w => w !== lowerWord)
          };
        } else {
          return { ...s, availableWords: [...s.availableWords, lowerWord] };
        }
      });
    },
    
    // Reset to default settings
    resetToDefaults: () => {
      settings.set({
        wordsPerSession: DEFAULT_WORDS_PER_SESSION,
        availableWords: [...WORD_LIST.map(w => w.toLowerCase())],
        selectedLevel: DEFAULT_LEVEL
      });
    }
  };
}

export const settingsStore = createSettingsStore(); 