import {html} from '../lib/helpers.js';
import {EditorEvents, EditorHostEvents, FocusEvents} from './mappings.js';

const {assign, defineProperty} = Object;
const compose = ({tag, content, ...properties}, element = tag && (element = document.createElement(tag))) =>
  (element && assign(element, properties)) || undefined;
const construct = (tag, properties) => assign(document.createElement(tag), properties);

// const Events = [...ClipboardEvents, ...InputEvents, ...CompositionEvents, ... KeyboardEvents];

class Cursor {
  /**
   * @param {Editor} editor
   * @param {HTMLSlotElement} [slot]
   */
  constructor({container}, slot) {
    [
      this.editor,
      this.slot = container.querySelector('slot[name=cursor]') ||
        container.appendChild(construct('slot', {name: `cursor`})),
    ] = arguments;
  }
}

class Editor {
  /**
   * @param {HTMLElement} container
   * @param {ShadowRoot | HTMLElement} [host]
   */
  constructor(container, host) {
    [this.container, this.host = (host = container)] = arguments;
    this.slot = container.querySelector('slot:not([name])') || container.appendChild(construct('slot'));

    for (const event of EditorEvents) {
      host.addEventListener(event, event => {
        let returned;
        if (this[`[${event.type}]`]) {
          returned = this[`[${event.type}]`](event);
        } else console.log('[host] %o', event);
        return returned;
      });
    }

    for (const event of FocusEvents) {
      container.addEventListener(event, event => {
        console.log('[container] %o', event);
      });
    }
  }

  /**
   * @param {CompositionEvent} event
   */
  [`[${EditorEvents.KeyDown}]`](event) {
    if (event.key === 'Tab' && !(event.altKey || event.ctrlKey || event.metaKey)) {
      document.execCommand(event.shiftKey ? 'outdent' : 'indent');
      event.preventDefault();
      // console.log('%o', event);
    }
  }
  /**
   * @param {CompositionEvent} event
   */
  [`[${EditorEvents.BeforeInput}]`](event) {
    const staticRange = event.getTargetRanges();
    // event.stopPropagation();
    console.log('[host] %o', event, ...staticRange);
  }
  /**
   * @param {CompositionEvent} event
   */
  [`[${EditorEvents.Input}]`](event) {
    // const staticRange = event.getTargetRanges();
    switch (event.inputType) {
      case 'formatIndent': {
        event.preventDefault();
        return false;
        break;
      }
    }
    // event.stopPropagation();
    // console.log(event, ...staticRange);
  }
}

class ShadowEditor extends HTMLElement {
  constructor() {
    const host = super();
    /** @type {ShadowRoot} */
    const shadowRoot = host.attachShadow({mode: 'open'});
    const template = new.target.template.cloneNode(true);
    const editor = (host.editor = new Editor(template.querySelector('main'), host));
    const cursor = (host.cursor = new Cursor(editor));

    for (const event of EditorHostEvents) {
      host.addEventListener(event, event => {
        let returned;
        if (this[`[${event.type}]`]) {
          returned = this[`[${event.type}]`](event);
        } else console.log('[host] %o', event);
        return returned;
      });
    }

    shadowRoot.append(template);
  }

  /**
   * @param {FocusEvent} event
   */
  [`[${FocusEvents.FocusIn}]`](event) {
    const {
      shadowRoot: {activeElement: shadowElement},
    } = this;
    const {activeElement: documentElement} = document;
    console.log('[host] <focusin> %o', event, {shadowElement, documentElement});
  }

  connectedCallback() {
    this.contentEditable = true;
  }

  get cursor() {
    if (this.editor) return this.editor.cursor;
  }
  set cursor(value) {
    if (this.editor) this['(cursor)'] = this.editor.cursor = value;
  }
  get editor() {
    return this['(editor)'];
  }
  set editor(value) {
    this['(editor)'] = value;
  }
}

ShadowEditor.template = html`
  <style>
    :host {
      display: grid;
      grid-template-areas: 'header' 'main' 'footer';
      grid-template-rows: max-content auto max-content;
    }
    main {
      font-family: monospace;
      white-space: pre-wrap;
      grid-area: main;
      padding-left: var(--gutter-width, 2em);
      /* background-clip: content-box; */
      background-color: var(--editor-background, white);
    }
    header {
      grid-area: header;
    }
    footer {
      grid-area: footer;
    }
    *:hover {
      outline: 2px dotted #9999;
      outline-offset: -1px;
    }

    slot[name=cursor] {
      outline: 2px dotted #9999;
      <!-- outline-offset: -1px; -->
    }
  </style>
  <header><slot name="header">header</slot></header>
  <main></main>
  <footer><slot name="footer">footer</slot></footer>
`;

customElements.define('shadow-editor', ShadowEditor);

// <!-- <slot>main > slot</slot> -->
// <!-- <div id="content" contenteditable>main > div</div> -->
// <!-- <slot name="cursor"></slot> -->

// this.slot = compose({tag: 'slot', name: `cursor`}, container.querySelector('slot[name=cursor]')),

// const contentSlot = (this.contentSlot = main.querySelector('slot:not([name])') || main.appendChild());

// if (content) {
//   // contentSlot && contentSlot.addEventListener('slotted', event => void content.append(contentSlot.assignedNodes()));
// }
// const {content, contentSlot} = this;
// if (content) { if (contentSlot) { content.append(...contentSlot.assignedNodes()); } }

// /** @type {HTMLMainElement} */
// const mainElement = (this.mainElement = template.querySelector('main'));

// /** @type {HTMLElement} */
// const contentElement = mainElement.querySelector('#content');
// contentElement && (this.content = new Content(mainElement, contentElement));

// /** @type {HTMLSlotElement} */
// const cursorSlot = template.querySelector('slot[name=cursor]');
// cursorSlot && (this.cursor = new Cursor(this, cursorSlot));
// event => {
//   const {
//     // constructor: {name: classname},
//     inputType,
//     type,
//   } = event;
//   const types = [];
//   inputType && types.push(inputType);
//   // defineProperty(event, Symbol.toStringTag, {value: `${name}<${type}>`})
//   console.log(`%O<%O${':%O'.repeat(types.length)})> %o`, event, type, ...types, {...event});
// },
