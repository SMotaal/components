import {updateProperty} from './properties.js';

/** @typedef {import('./attributes')['Attributes']} Attributes */

export class Component extends HTMLElement {
  /** @type {Attributes<string> | undefined} */
  static get attributes() {}

  static set attributes(value) {
    this === Component || updateProperty(this, 'attributes', value);
  }

  /** @type {string[]} */
  static get observedAttributes() {
    return this.attributes;
  }

  static set observedAttributes(value) {
    this === Component || updateProperty(this, 'observedAttributes', value);
  }

  /** @type {{mode: 'open' | 'closed'} | undefined} */
  static get shadowRoot() {}

  static set shadowRoot(value) {
    this === Component || updateProperty(this, 'shadowRoot', value);
  }

  /** @type {DocumentFragment | undefined} */
  static get template() {}

  static set template(value) {
    this === Component || updateProperty(this, 'template', value);
  }

  /** @type {DocumentFragment | undefined} */
  static get styles() {}

  static set styles(value) {
    this === Component || updateProperty(this, 'styles', value);
  }

  constructor() {
    /** @type {this} */
    const host = super();

    const constructor = new.target;
    const {prototype, attributes, template, styles, shadowRoot} = constructor;

    const root =
      /** @type {ShadowRoot} */
      (shadowRoot && (shadowRoot === 'closed' && host.attachShadow({mode: 'closed'}))) ||
      ((shadowRoot === true || shadowRoot === 'open') && host.attachShadow({mode: 'open'})) ||
      (typeof shadowRoot === 'object' && 'mode' in shadowRoot && host.attachShadow(shadowRoot)) ||
      host;

    root === host && (host.style.visibility = 'hidden');

    /** @type {HTMLStyleElement} */
    let style;
    /** @type {DocumentFragment} */
    let fragment;

    if (attributes && attributes.length) {
      for (const attribute of attributes) {
        prototype.hasOwnProperty(attribute) ||
          Object.defineProperty(this, attribute, {
            get() {
              return this.hasAttribute(attribute)
                ? this.getAttribute(attribute)
                : attributes[attribute];
            },
            set(value) {
              value === null || value === undefined
                ? this.removeAttribute(attribute)
                : value === this.getAttribute(attribute) || this.setAttribute(attribute, value);
            },
          });
      }
      this.attributes.defaultAttributes = attributes;
      this.attributes.isInitialized = false;
    }

    if (styles) {
      style = document.createElement('style');
      style.textContent = styles;
      root === host || (style = void root.prepend(style));
    }

    if (template) {
      /** @type {DocumentFragment} */
      fragment = (template.content || template).cloneNode(true);
      for (const element of fragment.querySelectorAll('[id]')) {
        this[`#${element.id}`] = element;
      }
      for (const element of fragment.querySelectorAll('slot')) {
        const name = `::${element.name || ''}`;
        name in this || (this[name] = element);
      }
      root === host || (fragment = void root.prepend(fragment));
    }

    setTimeout(() => {
      style && (style = void root.prepend(style));
      fragment && (fragment = void root.prepend(fragment));
      root === host && (host.style.visibility = '');
    }, 0);
  }

  connectedCallback() {
    this.attributes.isInitialized === false && this.initializeAttributes();
    // this.shadowRoot &&
    //   this.shadowRoot.isInitialized === false &&
    //   typeof this.initializeShadowRoot === 'function' &&
    //   this.initializeShadowRoot();
  }

  attributeChangedCallback(attributeName, previousValue, nextValue) {
    previousValue === nextValue ||
      previousValue == nextValue ||
      (typeof this.updateAttribute === 'function'
        ? this.updateAttribute(attributeName, nextValue, previousValue)
        : attributeName in this && (this[attributeName] = nextValue));
  }

  initializeAttributes() {
    const {defaultAttributes, isInitialized} = this.attributes;
    if (!isInitialized && defaultAttributes) {
      this.attributes.isInitialized = true;
      for (const attribute in defaultAttributes) {
        this.updateAttribute(attribute, this[attribute]);
      }
    }
  }

  trace(detail, context = (detail && detail.target) || this, ...args) {
    const span = typeof context === 'string' ? '%s' : '%O';
    detail &&
      (detail.preventDefault
        ? console.log(`${span}â€¹%sâ€º %O`, context, detail.type, detail, ...args)
        : console.trace(`${span} %O`, context, detail, ...args));
  }
}
