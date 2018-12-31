'use strict';

import {html, Toggle, Attributes, Component, EventListener} from './helpers.js';
import {EditorCommands} from './editor-commands.js';

const START_OF_TEXT = '\x02';
const CARRIAGE_RETURN = '\x0D';
const LINE_FEED = '\x0A';
const START_OF_CONTENT = START_OF_TEXT;

/** @typedef {HTMLDivElement} DIV */
/** @typedef {HTMLSlotElement} SLOT */
/** @typedef {'rtl' | 'ltr' | 'auto'} direction */
/** @typedef {0 | 2 | 4 | 8} tabsize */
export class CodeEditor extends Component {
  constructor() {
    super();

    this.onBeforeInput = EventListener.create(
      this,
      'beforeinput',
      this.onBeforeInput.bind(this),
      EventListener.Capture,
    );

    this.onInput = EventListener.create(
      this,
      'input',
      this.onInput.bind(this),
      EventListener.Capture,
    );

    this.onCopy = EventListener.create(this, 'copy', this.onCopy.bind(this), EventListener.Active);

    // this.onSelectStart = EventListener.create(
    //   this,
    //   'selectstart',
    //   this.onSelectStart.bind(this),
    //   EventListener.Capture,
    // );
    this.onSelectionChange = EventListener.create(
      this,
      'selectionchange',
      this.onSelectionChange.bind(this),
      EventListener.Capture,
    );

    this.shadowRoot.onSelectionChange = EventListener.create(
      this['#code'],
      'selectionchange',
      this.onSelectionChange,
      EventListener.Capture,
    );

    this.onSlotChange = EventListener.create(
      /** @type {SLOT} */
      this['#code'],
      'slotchange',
      this.onSlotChange.bind(this),
      EventListener.Passive,
    );

    // this['#code'].style.pointerEvents = 'none';

    // slot.addEventListener('slotchange', event => onSlotChange.call(this, event), Passive)
    // this.addEventListener('beforeinput', this.onbeforeinput.bind(this), Capture);
    // this.addEventListener('input', this.oninput.bind(this), Capture);
  }

  /// CUSTOM-ELEMENT REACTIONS

  connectedCallback() {
    this.updateContent();
    super.connectedCallback();
  }

  /// COMPONENT REACTIONS

  initializeAttributes() {
    // this.childElementCount || (this.innerHTML = this.innerHTML.trim() || '&#x0002;');
    this.contentEditable = true;
    // this['#textarea'] = this;
    super.initializeAttributes();
  }

  /**
   * Triggers side-effects for a changed attribute.
   *
   * @param {string} attributeName
   * @param  {any} newValue
   * @param  {any} oldValue
   */
  updateAttribute(attributeName, ...values) {
    values.length || values.push(this[attributeName]);
    switch (attributeName.toLowerCase()) {
      case 'linenumbers':
        this.updateLineNumbers(...values);
        break;
      case 'tabsize':
        this.updateTabSize(...values);
        break;
      // case 'direction':
      //   this.updateDirection(...values);
      //   break;
      // case 'readonly':
      //   this.updateReadonly(...values);
      //   break;
      // case 'autocorrect':
      //   this.updateAutoCorrect(...values);
      //   break;
    }
  }

  /// ELEMENT REACTIONS

  focus(target) {
    if (target && target.nodeType === this.ELEMENT_NODE) return target.focus();
    !this.shadowRoot || !this.shadowRoot.activeElement || this.shadowRoot.activeElement.blur();
    super.focus();
  }

  /** @param {Event} event */
  onSlotChange(event) {
    this.updateContent();
    this.trace(event, '#code');
  }

  /** @type {ClipboardEvent} */
  onCopy(event) {
    const {clipboardData} = event;
    const selection = window.getSelection();
    let content, error;
    try {
      if (selection.containsNode(this, /* partial */ true)) {
        content = selection.toString();
      }
    } catch (exception) {
      error = exception;
    }
    this.trace(event, this, {selection, clipboardData}, error || content);
    event.preventDefault();
    event.stopPropagation();
  }

  /** @type {Event} */
  onSelectStart(event) {
    this.trace(event, this); // , {selection, clipboardData}, error || content
    event.preventDefault();
    event.stopPropagation();
  }
  /** @type {Event} */
  onSelectionChange(event) {
    this.trace(event, this); // , {selection, clipboardData}, error || content
    event.preventDefault();
    event.stopPropagation();
  }

  /** @param {TextEvent} event */
  onInput(event) {
    if (!event || !event.inputType) {
      this.trace(event, this);
    } else {
      const {inputType, data, dataTransfer} = event;
      if (inputType.startsWith === 'delete') {
        this.updateContent();
        this.trace(event, this, {data, dataTransfer}, ...this.childNodes);
        // } else if (inputType === 'insertParagraph') {
        //   const selection = this.getSelection();
        //   this.trace(event, this, {data, dataTransfer, selection}); // ranges,
      } else {
        this.trace(event, this, {data, dataTransfer}); // ranges,
      }
      event.stopPropagation();
    }
  }

  /** @param {TextEvent & ClipboardEvent & DragEvent} event */
  onBeforeInput(event) {
    event => {
      if (!event || !event.inputType) {
        this.trace(event, this);
      } else {
        /** @type {TextEvent & ClipboardEvent & DragEvent} */
        const {inputType, data, dataTransfer} = event;

        if (inputType.startsWith('insert')) {
          let data, inserted;
          if (dataTransfer) {
            if (inputType === 'insertFromPaste') {
              event.preventDefault();
              data = dataTransfer.getData('text/plain');
              if (data) inserted = EditorCommands.insertTextAtCursor(data);
              this.trace(event, this, {inserted, dataTransfer});
            }
          } else if (data) {
            return;
            // const {
            //   childElementCount: elementCount,
            //   firstChild: firstNode,
            //   firstElementChild: firstElement,
            // } = this;
            // if (
            //   elementCount === 1 &&
            //   firstNode === firstElement &&
            //   firstElement.childElementCount === 0 &&
            //   firstElement.textContent === START_OF_CONTENT
            // ) {
            //   event.preventDefault();
            //   firstElement.textContent = data;
            // }
          }
        }
        event.stopPropagation();
      }
    };
  }

  /// INTERNAL METHODS

  getSelection() {
    return (
      (this.shadowRoot && this.shadowRoot.getSelection && this.shadowRoot.getSelection()) || null
    );
  }

  resetContent(html) {
    const previousContent = this.textContent;
    this.innerHTML = `<pre>${html || START_OF_CONTENT}</pre>`;
    this.trace({previousContent}, 'resetContent');
  }

  updateContent(html) {
    if (
      html ||
      !this.hasChildNodes ||
      !this.childElementCount ||
      (this.childElementCount === 1 &&
        (this.firstChild.nodeName === 'BR' || !(html = this.textContent)))
    ) {
      this.resetContent(html);
    } else {
      /** @type {Iterable<HTMLElement>} */
      // const divs = this.querySelectorAll(':scope > :not(code)');
      // const divs = this.querySelectorAll('div');
      // if (divs) {
      //   for (const div of divs) {
      //     div.replaceWith(...div.children, document.createElement('br'));
      //   }
      // }
    }
  }

  /** @param {direction} newValue */
  updateDirection(newValue, oldValue) {
    this['#textarea'] && (this['#textarea'].dir = newValue);
  }

  /** @param {boolean} newValue */
  updateLineNumbers(newValue, oldValue) {
    newValue = newValue === '' || Toggle(newValue);
    this['#linenumbers'] && (this['#linenumbers'].hidden = newValue);
    // const classList = this['#wrapper'] && this['#wrapper'].classList;
    const classList = this.classList;
    classList && (newValue ? classList.add('line-numbers') : classList.remove('line-numbers'));
  }

  /** @param {boolean} newValue */
  updateReadonly(newValue, oldValue) {
    this['#textarea'] &&
      (newValue === '' || Toggle(newValue)
        ? this['#textarea'].setAttribute('readonly', '')
        : this['#textarea'].removeAttribute('readonly'));
  }

  /** @param {boolean} newValue */
  updateAutoCorrect(newValue, oldValue) {
    this['#textarea'] &&
      Object.assign(this['#textarea'], {
        spellcheck: (newValue = newValue === '' || Toggle(newValue)),
        autocapitalize: newValue,
        autocomplete: newValue,
        autocorrect: newValue,
      });
  }

  /** @param {tabsize} newValue */
  updateTabSize(newValue, oldValue) {
    this['#wrapper'] &&
      this['#wrapper'].style.setProperty(
        '--tab-size',
        (newValue && newValue > 0 && parseInt(newValue)) || 'initial',
      );
  }
}

try {
  const base = `${new URL('./', import.meta.url)}`;
  const local = specifier => `${new URL(specifier, base)}`;

  CodeEditor.shadowRoot = {mode: 'open'};
  CodeEditor.template = html`
    <style>
      @import '${local('./styles.css')}';
      @import '${local('./code.css')}';
      @import '${local('./overload.css')}';
    </style>
    <div id="wrapper">
      <div id="content"><slot id="code" class="indent"></slot></div>
    </div>
  `;
  CodeEditor.attributes = Attributes.from({
    /** @type {direction} */ direction: undefined,
    /** @type {tabsize}   */ tabsize: 2,
    /** @type {boolean}   */ autocorrect: false,
    /** @type {boolean}   */ linenumbers: true,
    /** @type {boolean}   */ readonly: false,
  });

  customElements.define('code-editor', CodeEditor);
} catch (exception) {
  console.warn(exception);
}
