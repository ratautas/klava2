# Klava2 Project Structure

## Overview
Klava2 appears to be a word-typing application built with SvelteKit, designed to help users practice typing Lithuanian words with various difficulty levels. The application features a game-like experience with sessions, settings, and results tracking.

## Routes (`/src/routes`)

### Main Routes
- **/** - Main landing page
- **/[word]** - Dynamic route for displaying a word for the user to view/listen to
  - **/[word]/input** - Word typing interface where users input the letters
- **/results** - Shows session results after completion
- **/settings** - User configuration interface for game settings

### API Routes
- **/api/tts** - Text-to-speech API endpoint for word pronunciation

## Library (`/src/lib`)

### Components
- **KeyCap.svelte** - Keyboard key component for UI
- **ProgressBullets.svelte** - Session progress indicator
- **WordDisplay.svelte** - Component for displaying words

### Stores
- **session.ts** - Manages typing session state (current word, progress, etc.)
- **settings.ts** - User preferences and application settings
- **words.ts** - Handles word lists and word selection logic

### Services
- **tts.ts** - Text-to-speech service for word pronunciation

### Utils
- Contains utility functions for the application

### Types
- **types.ts** - TypeScript definitions including:
  - `Difficulty` levels (easy, medium, hard)
  - `GameState` interface
  - `LetterState` interface
  - Word lists by difficulty level

## Core Functionality

1. **Word Practice System**
   - Users practice typing Lithuanian words
   - Words are presented one by one in a session
   - Input validation with immediate feedback

2. **Session Management**
   - Configurable number of words per session
   - Progress tracking throughout the session
   - Results summary after completion

3. **Audio Support**
   - Text-to-speech functionality for word pronunciation
   - Audio playback management

4. **Settings & Customization**
   - Difficulty level selection
   - Session length configuration
   - Other user preferences

5. **Responsive UI**
   - Interactive keyboard navigation
   - Progress visualization
   - Success/error feedback 