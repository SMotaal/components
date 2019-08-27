// @ts-check
import {Component} from './component.js';

export const components = {};

/** @type {(typeof Component)['html']} */
components.html = import.meta['components.html'];
/** @type {(typeof Component)['css']} */
components.css = import.meta['components.css'];
/** @type {(typeof Component)['styling']} */
components.styling = import.meta['components.styling'];
/** @type {(typeof Component)['Assets']} */
components.Assets = import.meta['components.Assets'];
/** @type {(typeof Component)['Attributes']} */
components.Attributes = import.meta['components.Attributes'];

components.Component = import.meta['components.Component'] = Component;
