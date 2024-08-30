import { writable, readable } from 'svelte/store';

export const messages = readable({
	error: 'An error occured. Please try again later.'
});

export const email = writable('');
