import {html, raw, css, Component, local, Flags} from '../helpers.js';
import {SourceView} from '../classes/source-view.js';
// import {SPAN, BLOCK} from '../classes/source-rows.js';

import {sourceTextStyle, sourceTextStyleInherit} from './source-text.js';

export const SPAN = 'code';
export const BLOCK = 'source-text';

const styles = css`
  @import '${local(`styles/theme/code-theme.css`)}';
  @import '${local(`styles/theme/code-host.css`)}';

  :host {
    box-sizing: border-box;
    background-color: var(--code-background-color);
    ${sourceTextStyle}
  }

  #wrapper {
    display: grid;
    width: max-content;
    height: max-content;
    min-width: 100%; min-height: 100%;
  }

  #content {
    color: var(--code-text-color);
    background-color: var(--code-background-color);
    counter-reset: line-number var(--code-first-line-number, 1);
  }

  slot#code {
    counter-reset: line-number var(--code-first-line-number, 1);
    --code-wrap-indent: 1em;
    white-space: pre;

    ${'' && sourceTextStyle}
  }

  slot#code::slotted(*) {
    box-sizing: content-box;
    margin: 0;
    padding: 0;

    ${'' && sourceTextStyle}
  }

  slot#code::slotted(source-text:not([line-number])) {
    counter-increment: line-number;
  }

  slot#code::slotted(:active) {
    outline: 0.5px solid #999;
    background-color: #9993;
  }

`;

/** @implements {SourceView} */
export class SourceViewElement extends Component {
  constructor() {
    super();
    this.sourceView = new SourceView(this);

    /** @type {HTMLSlotElement} */ const slot = this['::'];

    slot && slot.addEventListener('slotchange', event => this.updateContent(), {passive: true});
  }

  set source(source) {
    this.sourceView && (this.sourceView.source = source);
  }

  get source() {
    return (this.sourceView && this.sourceView.source) || undefined;
  }

  updateContent() {
    /** @type {this & {[name: '::' | '::code']: HTMLSlotElement}} */
    const {'::code': code, '::': slot = code, ELEMENT_NODE, TEXT_NODE} = this;
    if (!slot) return;
    const options = {slot: code.name};
    const assignedNodes = slot && slot.assignedNodes();
    if (!assignedNodes || !assignedNodes.length) return;
    if (assignedNodes && assignedNodes.length) {
      const text = [];
      for (let node of assignedNodes) {
        if (node.nodeType === TEXT_NODE) {
          node.length && text.push(node);
          node.remove();
        } else {
          text.length && this.wrapNodes(text.splice(0, text.length), SPAN, BLOCK, options);
          if (node.nodeName === 'DIV') {
            const textContent = node.textContent;
            if (textContent && !textContent.trim()) {
              for (const line of textContent.split('\n').reverse()) {
                // line ?
                line &&
                  node.before(
                    this.wrapNodes(
                      [new Text(line), document.createElement('br')],
                      SPAN,
                      BLOCK,
                      options,
                    ),
                  );
                // const block = document.createElement(BLOCK);
                // block.textContent = line;
                // block.appendChild(document.createElement('<br/>'));
              }
              node.remove();
            } else if (textContent) {
              this.unwrapNodes(node, options);
            } else {
              node.remove();
            }
          } else if (node.nodeType === ELEMENT_NODE) {
            node.slot = options.slot;
          }
        }
      }
      text.length && this.wrapNodes(text, SPAN, BLOCK, options);
    }
    // this.normalize();
    // for (const node of removed) node.remove();
  }

  connectedCallback() {
    super.connectedCallback();
    this['::code'] && (this['::code'].hidden = false);
  }

  /** @param {HTMLElement} element */
  unwrapNodes(element, {slot, force = false} = {}) {
    let unwrapped;
    if (element && element.parentElement && (force || element.parentElement === this)) {
      unwrapped = [...element.children];
      if (slot) for (const element of unwrapped) element.slot = slot;
      element.before(...unwrapped);
      element.remove();
    } else {
      unwrapped = [element];
    }
    return unwrapped;
  }

  wrapNodes(nodes, ...wrappers) {
    let inner, outer;
    for (const wrapper of wrappers.length ? wrappers : [SPAN]) {
      if (wrapper) {
        const element =
          typeof wrapper === 'string'
            ? document.createElement(wrapper)
            : wrapper.nodeType === this.ELEMENT_NODE && wrapper;
        if (element) {
          inner || (inner = element);
          outer && element.appendChild(outer);
          outer = element;
        } else if (typeof wrapper === 'object') {
          Object.assign(element, wrapper);
        }
      }
    }
    if (nodes.length) {
      const first = (nodes.splice ? nodes : (nodes = [...nodes]))[0];
      first.before(outer), outer.append(...nodes);
    }
    return outer;
  }

  updateSource() {
    // TODO: Attach to new source document
  }

  releaseSource() {
    // TODO: Detach from current source document
    this.innerHTML = '';
  }

  updateRows() {
    const rows = (this.sourceView && this.sourceView.rows) || null;
    if (rows && rows.renderRows) {
      this.innerHTML = rows
        .renderRows({tabSize: this.tabsize, block: BLOCK, span: SPAN, nobreak: false})
        .join('\n');
    } else {
      this.innerHTML = '';
    }
  }
}

try {
  SourceViewElement.shadowRoot = {mode: 'open'};

  SourceViewElement.styles = styles;

  SourceViewElement.template = html`
    <div id="wrapper">
      <div id="content"><slot id="code" name="code" hidden></slot></div>
    </div>
    <!-- Triage -->
    <slot style="display: none;" inert hidden></slot>
  `;

  customElements.define('source-view', SourceViewElement);
} catch (exception) {
  console.warn(exception);
}

const START_OF_TEXT = '\x02';
const CARRIAGE_RETURN = '\x0D';
const LINE_FEED = '\x0A';
const START_OF_CONTENT = START_OF_TEXT;

/** @typedef {HTMLDivElement} DIV */
/** @typedef {HTMLSlotElement} SLOT */

// connectedCallback() {
//   this.updateContent();
//   super.connectedCallback();
// }

// updateContent(html) {
//   if (
//     html ||
//     !this.hasChildNodes ||
//     !this.childElementCount ||
//     (this.childElementCount === 1 &&
//       (this.firstChild.nodeName === 'BR' || !(html = this.textContent)))
//   ) {
//     this.resetContent(html);
//   } else {
//     /** @type {Iterable<HTMLElement>} */
//     // const divs = this.querySelectorAll(':scope > :not(code)');
//     // const divs = this.querySelectorAll('div');
//     // if (divs) {
//     //   for (const div of divs) {
//     //     div.replaceWith(...div.children, document.createElement('br'));
//     //   }
//     // }
//   }
// }

// resetContent(html) {
//   const previousContent = this.textContent;
//   this.innerHTML = `<pre>${html || START_OF_CONTENT}</pre>`;
//   this.trace({previousContent}, 'resetContent');
// }

// spanWrap(...nodes) {
//   const span = block.appendChild(document.createElement(SPAN));
//   nodes.length && span.append(...nodes);
//   return span;
// }

// blockWrap(...nodes) {
//   const block = block.appendChild(document.createElement(BLOCK));
//   nodes.length && block.append(...nodes);
//   return block;
// }

// /*
// slot#code::slotted(source-text[line-number]) {
//   counter-reset: line-number attr("line-number");
// }
// */

/*
  :host > * {
    ${'' && sourceTextStyleInherit};
  }
  */
