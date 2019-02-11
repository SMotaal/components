export const base = `${new URL('./', import.meta.url)}`;
export const local = specifier => `${new URL(specifier, base)}`;

export {html, Attributes, Component} from '../../elements/helpers.js';
export {globals} from '../../helpers.js';
export {EventListener} from '../../../lib/events.js';
export {Toggle} from '../../../lib/attributes.js';

import {loadSourceTextFrom} from '../../helpers.js';
export const {renderSourceText, renderSourceTextFrom} = (helpers =>
  (helpers = {
    /** @type {HTMLTemplateElement} */
    get template() {
      let value;
      try {
        value = document.createElement('template');
      } catch (exception) {
        value = {};
      }
      Object.defineProperty(this, 'template', {value});
      return value;
    },

    /**
     * @param {string} sourceText
     * @param {HTMLElement|DocumentFragment} [container]
     * @param {boolean} [append]
     */
    renderSourceText: (sourceText, container, append = false) => {
      container && !append && (container.innerHTML = '');

      const {template} = helpers;

      template.innerHTML = '';
      const fragment = template.content;

      for (const line of sourceText.split('\n')) {
        const element = document.createElement('pre');
        element.textContent = line || '\n';
        fragment.appendChild(element);
      }

      (container || (container = document.createDocumentFragment())).appendChild(template.content);

      return container;
    },

    /**
     * @param {string} sourceText
     * @param {DocumentFragment|HTMLElement} [container]
     * @param {boolean} [append]
     */
    async renderSourceTextFrom(src, container, append = false) {
      return renderSourceText(await loadSourceTextFrom(src), container, append);
    },
  }))();
