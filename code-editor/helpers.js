/// <reference path="./types.d.ts" />

export * from '../lib/helpers.js';

export const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

export const initializeProperty = (
  target,
  property,
  {value, get, set, writable = true, enumerable = true, configurable = true},
) => (
  !target ||
    !property ||
    hasOwnProperty(target, property) ||
    Object.defineProperty(
      target,
      property,
      get || set ? {get, set, enumerable, configurable} : {value, writable, enumerable},
    ),
  target
);

/**
 * @template {{[name: K]: V}} T
 * @template {string|symbol} K
 * @template V
 * @param {T} target
 * @param {K} property
 * @param {V} value
 */
export const updateProperty = (target, property, value) => (
  !target ||
    !property ||
    ((!hasOwnProperty(target, property) ||
      (Object.getOwnPropertyDescriptor(property) || '').configurable !== false) &&
      Object.defineProperty(target, property, {
        get: () => value,
        set: value => updateProperty(target, property, value),
        configurable: true,
      })),
  target
);

/**
 * @template {string} K
 * @extends {Array<K>}
 */
export class Attributes extends Array {
  /**
   * @param {{[index: number]:K} | {[name: K]}} attributes
   */
  constructor(attributes) {
    const names =
      (attributes &&
        ((Symbol.iterator in attributes && attributes) ||
          Object.getOwnPropertyNames(attributes))) ||
      '';
    super(...names);
    !attributes || names === attributes || Object.assign(this, attributes);
  }

  *entries() {
    for (const key of super[Symbol.iterator]()) {
      yield [key, this[key]];
    }
  }

  /**
   * @template {string} K
   * @template {{[name: K]}} T
   * @param {...T} definitions
   * @returns {Attributes<K> | T}
   */
  static from(...definitions) {
    const attributes = {};

    for (const object of definitions) {
      for (const name of Symbol.iterator in object ? object : Object.getOwnPropertyNames(object)) {
        typeof name !== 'string' ||
          (name in attributes
            ? // Assign to undefined default
              attributes[name] === undefined || (attributes[name] = object[name])
            : // Add name to the set of names and initialize default
              (attributes[name] = object[name]));
      }
    }

    // return Object.assign(new this(...names), defaults);
    return new this(attributes);
  }
}

Object.defineProperties(Attributes.prototype, {
  [Symbol.toStringTag]: {value: 'Attributes'},
  [Symbol.isConcatSpreadable]: {value: false},
});

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
    this === CodeEditor || updateProperty(this, 'observedAttributes', value);
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

  constructor() {
    /** @type {this} */
    const host = super();

    const constructor = new.target;
    const {prototype, attributes, template, shadowRoot} = constructor;

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

    const root =
      /** @type {ShadowRoot} */
      (shadowRoot && (shadowRoot === 'closed' && host.attachShadow({mode: 'closed'}))) ||
      ((shadowRoot === true || shadowRoot === 'open') && host.attachShadow({mode: 'open'})) ||
      (typeof shadowRoot === 'object' && 'mode' in shadowRoot && host.attachShadow(shadowRoot)) ||
      host;

    if (template) {
      /** @type {DocumentFragment} */
      const fragment = (template.content || template).cloneNode(true);
      for (const element of fragment.querySelectorAll('[id]')) {
        this[`#${element.id}`] = element;
      }
      root.append(fragment);
      // root.hidden = true;
    }
  }

  connectedCallback() {
    this.attributes.isInitialized === false && this.initializeAttributes();
  }

  attributeChangedCallback(attributeName, previousValue, nextValue) {
    previousValue === nextValue ||
      previousValue == nextValue ||
      typeof this.updateAttribute !== 'function' ||
      this.updateAttribute(attributeName, nextValue, previousValue);
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
        ? console.log(`${span}‹%s› %O`, context, detail.type, detail, ...args)
        : console.trace(`${span} %O`, context, detail, ...args));
  }
}

// /**
//  * @template {{[name: K]?}} T
//  * @template {string} K
//  * @param  {...Array<K> | T} attributes
//  * @returns {Array<K & keyof T> & T}
//  */
// export const Attributes = (...attributes) => {
//   const names = new Set();
//   const defaults = {
//     [Symbol.toStringTag]: 'Attributes',
//     [Symbol.isConcatSpreadable]: false,
//   };

//   for (const object of attributes) {
//     for (const name of Symbol.iterator in object ? object : Object.getOwnPropertyNames(object)) {
//       typeof name !== 'string' ||
//         (names.has(name)
//           ? // Assign to undefined default
//             defaults[name] === undefined || (defaults[name] = object[name])
//           : // Add name to the set of names and initialize default
//             (defaults[name] = (names.add(name), name in object || (undefined && object[name]))));
//     }
//   }

//   return Object.assign([...names], defaults);
// };
