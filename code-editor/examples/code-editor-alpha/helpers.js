export const base = `${new URL('./', import.meta.url)}`;
export const local = specifier => `${new URL(specifier, base)}`;

export {html, Attributes, Component} from '../../elements/helpers.js';
export {globals, renderSourceTextFrom, loadSourceTextFrom} from '../../helpers.js';

export {EventListener} from '../../../lib/events.js';
export {Toggle} from '../../../lib/attributes.js';
