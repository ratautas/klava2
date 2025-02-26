import { redirect } from '@sveltejs/kit';
import { sessionStore } from '$lib/stores/session';

export function load() {
    // Use the session's current word or start a new session
    const currentWord = sessionStore.getCurrentWord();
    throw redirect(307, `/${currentWord}`);
} 