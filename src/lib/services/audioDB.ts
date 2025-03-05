import Dexie, { type Table } from 'dexie';
import { browser } from '$app/environment';
import { synthesizeSpeech } from './tts';

// Define the structure of our database
interface AudioData {
  id?: number; // Primary key (auto-incremented)
  word: string; // Word used as index for fast lookup
  audio: string; // Base64 audio data
  timestamp: number; // When the audio was cached
}

// Create our Dexie database
class AudioDatabase extends Dexie {
  audioItems!: Table<AudioData, number>;

  constructor() {
    super('WordAudioDatabase');
    
    // Define schema with version number
    this.version(1).stores({
      audioItems: '++id, word, timestamp'
    });
  }

  // Check if a word's audio exists in the database
  async hasAudio(word: string): Promise<boolean> {
    if (!browser) return false;
    
    try {
      const item = await this.audioItems
        .where('word')
        .equals(word.toLowerCase())
        .first();
      
      return !!item;
    } catch (error) {
      console.error('Error checking audio existence:', error);
      return false;
    }
  }

  // Get audio for a word from database
  async getAudio(word: string): Promise<string | null> {
    if (!browser) return null;
    
    try {
      const item = await this.audioItems
        .where('word')
        .equals(word.toLowerCase())
        .first();
      
      if (item) {
        return item.audio;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting audio from database:', error);
      return null;
    }
  }

  // Store audio in the database
  async storeAudio(word: string, audioBase64: string): Promise<void> {
    if (!browser) return;
    
    try {
      // Check if the word already exists
      const exists = await this.hasAudio(word);
      
      if (!exists) {
        await this.audioItems.add({
          word: word.toLowerCase(),
          audio: audioBase64,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error storing audio in database:', error);
    }
  }

  // Fetch audio for a word, from database if available or from API if not
  async fetchAudio(word: string): Promise<string> {
    if (!browser) {
      throw new Error('Cannot fetch audio on server side');
    }
    
    try {
      // Try to get from database first
      const cachedAudio = await this.getAudio(word);
      
      if (cachedAudio) {
        return cachedAudio;
      }
      
      // If not in database, fetch from API
      const audioBase64 = await synthesizeSpeech(word);
      
      // Store in database for future use
      await this.storeAudio(word, audioBase64);
      
      return audioBase64;
    } catch (error) {
      console.error('Error fetching audio:', error);
      throw error;
    }
  }

  // Pre-fetch audio for multiple words in parallel
  async preFetchWordAudio(words: string[]): Promise<void> {
    if (!browser) return;
    
    try {
      // Filter out words that already have audio in the database
      const wordsToFetch: string[] = [];
      
      for (const word of words) {
        const exists = await this.hasAudio(word);
        if (!exists) {
          wordsToFetch.push(word);
        }
      }
      
      if (wordsToFetch.length === 0) {
        return; // All words already have audio
      }
      
      // Fetch audio for each missing word in parallel
      const fetchPromises = wordsToFetch.map(async (word) => {
        try {
          const audioBase64 = await synthesizeSpeech(word);
          await this.storeAudio(word, audioBase64);
        } catch (error) {
          console.error(`Error pre-fetching audio for word "${word}":`, error);
        }
      });
      
      // Wait for all fetches to complete
      await Promise.all(fetchPromises);
      
    } catch (error) {
      console.error('Error pre-fetching audio:', error);
    }
  }
}

// Create and export the database instance
export const audioDB = new AudioDatabase(); 