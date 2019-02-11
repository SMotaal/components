export {loadSourceTextFrom} from '../lib/fetch.js';
export {globals} from '../lib/globals.js';

export const base = `${new URL('./', import.meta.url)}`;
export const local = specifier => `${new URL(specifier, base)}`;
