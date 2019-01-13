export {html, raw} from '../lib/templates.js';
export {css} from '../lib/css.js';
export {EventListener} from '../lib/events.js';
export {Toggle} from '../lib/attributes.js';
// export * from '../lib/expressions.js';

// export {hasOwnProperty, initializeProperty, updateProperty} from './helpers/properties.js';
export {Flags} from './helpers/flags.js';
export {Attributes} from './helpers/attributes.js';
export {Component} from './helpers/component.js';
export {loadSourceTextFrom, renderSourceTextFrom} from './helpers/demo.js';
export {globals} from '../lib/globals.js';

export const base = `${new URL('./', import.meta.url)}`;
export const local = specifier => `${new URL(specifier, base)}`;
