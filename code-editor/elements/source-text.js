import {html, css, Component, local, Attributes} from '../helpers.js';

export const sourceTextStyle = css`
  /* source-text-style */
  font-size: var(--code-font-size);
  font-family: var(--code-font-family, monospace);
  line-height: var(--code-line-height, 2em);
  tab-size: var(--tab-size, 2);
`;
// .trim()
// .replace(/^(\s+)/gm, '$1  ');

export const sourceTextStyleInherit = sourceTextStyle
  .replace(/^(.*?):[^]+?;(\s*)$/gm, '$1: inherit;$1')
  .replace('/* source-text-style */', '/* source-text-style-inherit */');

const styles = css`
  /* @import '${local(`styles/theme/code-theme.css`)}'; */
  /* @import '${local(`styles/theme/code-host.css`)}'; */

  :host {
    white-space: normal;
    display: grid;
    grid-template:
      'gutter code'
      auto / calc(2 * var(--code-gutter-inset, 0) + var(--code-gutter-width)) auto;
    grid-gap: 0.5ch;
    counter-increment: line-number;

    /* outline: none; */
    /* box-sizing:content-box; */

    ${sourceTextStyle}
  }

  :host::after {
    content: counter(line-number);
    grid-area: gutter;

    display: block;
    left: 0;
    position: sticky;

    text-align: right;
    padding: 0 var(--code-gutter-inset);

    background-color: var(--code-gutter-background);
    user-select: none;
  }

  :host(:hover) {
    background-color: #9991;
  }


  slot#code {
    --float: left;
    /* --tint: transparent; */

    grid-area: code;
    display: block;
    white-space: nowrap;
  }

  :host-context(:dir(right)) slot#code {
    --float: right;
  }

  slot#code::slotted(*) {
    float: var(--float);

    ${sourceTextStyle}
  }

  slot#code::slotted(*:hover) {
    outline: 1px solid var(--tint, #9993);
    box-shadow: inset 0 0 1px 1em var(--tint, #9993);
    background-color: var(--tint, transparent);
  }

  slot#code::slotted(code) {
    /* --tint: #0f01; */
    white-space: pre;
    pointer-events: all;
  }

  slot#code::slotted(code:hover) {
    --tint: #0f01;
  }

  slot#code::slotted(code.indent) {
    --tint: transparent;
    /* border: 0.5px solid transparent; */
    -webkit-border-end: 0.5px solid #9993;
    border-inline-end: 0.5px solid #9993;
    color: #00f9;
    width: calc(1em * var(--tab-size, 2));
    display: block;
  }

  slot#code::slotted(code.indent:hover) {
    --tint: #00f1;
  }

  slot#code::slotted(code:empty) {
    --tint: #f001;
    /* outline: 1px solid red; */
    /* display: block; */
    /* white-space: pre; */
    width: 1em;
    height: var(--code-line-height, 2em);
  }

  slot#code::slotted(code:empty)::before {
    content: '\23CE';
    color: #fff;
  }

  slot#code::slotted(code:empty:hover) {
    --tint: #f003;
  }

`;

export class SourceTextElement extends Component {
  constructor() {
    super();
    const {'::': slot, '::code': codeSlot, ELEMENT_NODE} = this;

    slot &&
      codeSlot &&
      slot.addEventListener(
        'slotchange',
        event => {
          const removed = new Set();
          const slotted = new Set();
          for (const node of slot.assignedNodes()) {
            node.nodeType === ELEMENT_NODE
              ? ((node.slot = 'code'), slotted.add(node))
              : (node.remove(), removed.add(node));
          }
          // this.hidden = !this.textContent;
          // console.log({removed: [... removed], slotted: [... slotted]});
        },
        {passive: true},
      );
  }

  connectedCallback() {
    super.connectedCallback();
    this['::code'] && (this['::code'].hidden = false);
  }
}

try {
  // const base = `${new URL('./', import.meta.url)}`;
  // const local = specifier => `${new URL(specifier, base)}`;

  SourceTextElement.shadowRoot = {mode: 'open'};

  SourceTextElement.observedAttributes = Attributes.from(['line-number']);

  SourceTextElement.styles = styles;
  SourceTextElement.template = html`
    <slot id="code" name="code" hidden><br /></slot>
    <!-- <br /> -->
    <!-- Triage -->
    <slot style="display: none;" inert hidden></slot>
  `;

  customElements.define('source-text', SourceTextElement);
} catch (exception) {
  console.warn(exception);
}

// export const sourceTextStyle = {
//   'font-size': 'var(--code-font-size);',
//   'font-family': 'var(--code-font-family) monospace;',
//   'line-height': 'var(--code-line-height);',
//   'tab-size': 'var(--tab-size, 2);',
// };
