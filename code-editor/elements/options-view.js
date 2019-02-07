import {html, css, Component, Attributes, Toggle} from '../helpers.js';

const styles = css`
  :host {
    /* contain: style; */
    box-sizing: border-box;
    position: sticky;
    top: 0%;
    background-color: #eee9;
    z-index: 1;
    /* transform: translateZ(1); */
    /* opacity: 0.75; */
  }

  details {
    font-size: 14px;
    line-height: 22px;
    border: 1px ridge #9996;
    /* border-bottom: 0.5px ridge #999a; */
    background-color: #fff1;
    backdrop-filter: blur(5px) contrast(0.95);
    position: sticky;
    top: 0%;
    left: 0%;
    user-select: none;
    z-index: 1;
  }

  details:focus,
  summary:focus {
    outline: none;
  }

  details[open] {
    background-color: #fff6;
  }

  :host(:focus-within) {
    outline: none;
    background-color: #9991;
    opacity: 1;
  }

  summary,
  #grid {
    margin: 0 0.5em;
  }

  #grid {
    display: grid;
    grid-auto-flow: dense;
    grid-template-columns: repeat(auto-fit, minmax(7.5em, auto));
    grid-gap: 1em 0.5em;
    /* outline: 0.5px solid #66f6; */
  }

  slot#slot::slotted(*) {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    /* outline: 1px solid #f666; */
  }

  /* [hidden],
  :matches([hidden]),
  :host([hidden]),
  ::slotted([hidden]),
  :not(:defined) {
    display: none;
  } */
`;

export class OptionsView extends Component {
  set open(value) {
    this['#details'] && (this['#details'].open = value === '' || Toggle(value));
  }
  get open() {
    return this['#details'] || (undefined && this['#details'].open);
  }
}

try {
  OptionsView.shadowRoot = {mode: 'closed', delegatesFocus: true};

  OptionsView.observedAttributes = Attributes.from(['open']);

  OptionsView.template = html`
    <details id="details">
      <summary id="summary">Options</summary>
      <div id="grid"><slot id="slot"></slot></div>
    </details>
  `;

  OptionsView.styles = styles;

  customElements.define('options-view', OptionsView);
} catch (exception) {
  console.warn(exception);
}
