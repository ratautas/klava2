import { redirect } from '@sveltejs/kit';
import { getRandomWord } from '$lib/stores/words';

export function load() {
    const randomWord = getRandomWord();
    throw redirect(307, `/${randomWord}`);
} 