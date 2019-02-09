import {html, css, local} from './helpers.js';
import {SourceViewElement} from './source-view.js';
import {sourceTextStyle, sourceTextStyleInherit} from './source-text.js';

import './options-view.js';

const styles = css`
  @import '${local(`elements/source-view.css`)}';
  :host {
    overflow-x: scroll;
    overflow-y: scroll;
    /* transform: translateZ(1); */
    /* ${sourceTextStyle} */
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
  SourceEditorElement.styles = styles;
  SourceEditorElement.template = html`
    <options-view id="options">
      <label><input id="is-editable" checked type="checkbox" />editable</label>
      <label><input id="use-spellcheck" type="checkbox" />spellcheck</label>
      <label><input id="use-autocorrect" type="checkbox" />autocorrect</label>
      <label><input id="use-autocapitalize" type="checkbox" />autocapitalize</label>
    </options-view>
    ${SourceViewElement.template}
  `;

  customElements.define('source-editor', SourceEditorElement);
} catch (exception) {
  console.warn(exception);
}
