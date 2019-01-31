import {html, css, Toggle} from '../helpers.js';
import {SourceViewElement} from './source-view.js';

import './options-view.js';

const style = css`
  :host {
    overflow-x: scroll;
    overflow-y: scroll;
    /* transform: translateZ(1); */
  }
`;

const createToggle = (input, toggle) => {
  if (!input || !toggle) return;
  // cleanup
  const checked = input.hasAttribute('checked') || input.checked;
  input.removeAttribute('checked');
  toggle((input.checked = checked));
  // attach
  input.addEventListener('change', () => void toggle(input.checked), {passive: true});
};

/** @implements {SourceView} */
export class SourceEditorElement extends SourceViewElement {
  constructor() {
    super();
    this.initializeOptions();
  }

  initializeOptions() {
    // TODO: Consider indexing `name=` in Component

    const rendered = new Promise(requestAnimationFrame);

    const editable = this;

    {
      /** @type {{[name:string]: HTMLInputElement }} */
      const {
        '#is-editable': contentEditable,
        '#use-spellcheck': spellcheck,
        '#use-autocorrect': autocorrect,
        '#use-autocapitalize': autocapitalize,
      } = this;

      contentEditable && createToggle(contentEditable, value => (editable.contentEditable = value));
      spellcheck && createToggle(spellcheck, value => (editable.spellcheck = value));
      autocorrect && createToggle(autocorrect, value => (editable.autocorrect = value));
      autocapitalize && createToggle(autocapitalize, value => (editable.autocapitalize = value));
    }
  }
}

try {
  // const base = `${new URL('./', import.meta.url)}`;
  // const local = specifier => `${new URL(specifier, base)}`;

  SourceEditorElement.shadowRoot = {mode: 'closed'};

  /** @type {DocumentFragment} */
  SourceEditorElement.template = SourceViewElement.template.cloneNode(true);

  SourceEditorElement.template.prepend(html`
    <options-view id="options">
      <!-- <label><input id="enable-outlines" type="checkbox" />outlines</label> -->
      <!-- <label><input id="enable-linenumbers" type="checkbox" />linenumbers</label> -->
      <!-- <label><input id="enable-wraplines" type="checkbox" />wrap-lines</label> -->
      <label><input id="is-editable" checked type="checkbox" />editable</label>
      <label><input id="use-spellcheck" type="checkbox" />spellcheck</label>
      <label><input id="use-autocorrect" type="checkbox" />autocorrect</label>
      <label><input id="use-autocapitalize" type="checkbox" />autocapitalize</label>
    </options-view>
    <style>
      ${style}
    </style>
  `);

  customElements.define('source-editor', SourceEditorElement);
} catch (exception) {
  console.warn(exception);
}
