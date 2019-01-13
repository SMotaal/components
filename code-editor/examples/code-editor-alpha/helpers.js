export const base = `${new URL('./', import.meta.url)}`;
export const local = specifier => `${new URL(specifier, base)}`;

export {globals, html, Toggle, Attributes, Component, EventListener, renderSourceTextFrom, loadSourceTextFrom} from '../../helpers.js';
