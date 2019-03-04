export {loadSourceTextFrom} from '../lib/fetch.js';
export {globals} from '../lib/globals.js';

export const local = specifier =>
  `${new URL(specifier, local.base || (local.base = `${new URL('./', import.meta.url)}`))}`;
