/// <reference path="./types.d.ts" />

export * from '../../lib/helpers.js';

// import {} from '../../lib/helpers.js';

export const DefaultsSymbol = Symbol.for('Defaults');
export const DescriptorsSymbol = Symbol.for('Descriptors');

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

    /** @type {AsyncIterableIterator} */
    this.reactions = this.reactions(new.target);
    //  new.target.Reactions.construct(new.target, this);

    // const constructor = this.constructor = new.target;
    // const {prototype, attributes, template, shadowRoot} = constructor;

    // if (attributes && attributes.length) {
    //   for (const attribute of attributes) {
    //     prototype.hasOwnProperty(attribute) ||
    //       Object.defineProperty(this, attribute, {
    //         get() {
    //           return this.hasAttribute(attribute)
    //             ? this.getAttribute(attribute)
    //             : attributes[attribute];
    //         },
    //         set(value) {
    //           value === null || value === undefined
    //             ? this.removeAttribute(attribute)
    //             : value === this.getAttribute(attribute) || this.setAttribute(attribute, value);
    //         },
    //       });
    //   }
    //   this.attributes.defaultAttributes = attributes;
    //   this.attributes.isInitialized = false;
    // }

    // const root =
    //   /** @type {ShadowRoot} */
    //   (shadowRoot && (shadowRoot === 'closed' && host.attachShadow({mode: 'closed'}))) ||
    //   ((shadowRoot === true || shadowRoot === 'open') && host.attachShadow({mode: 'open'})) ||
    //   (typeof shadowRoot === 'object' && 'mode' in shadowRoot && host.attachShadow(shadowRoot)) ||
    //   host;

    // if (template) {
    //   /** @type {DocumentFragment} */
    //   const fragment = (template.content || template).cloneNode(true);
    //   for (const element of fragment.querySelectorAll('[id]')) {
    //     this[`#${element.id}`] = element;
    //   }
    //   root.append(fragment);
    //   this.isInitialized = !('initialize' in this && typeof this.initialize === 'function');
    //   // root.hidden = true;
    // }
  }

  // connectedCallback() {
  //   // this.reactions.next('connectedCallback');
  //   this.attributes.isInitialized === false &&
  //     (this.initializeAttributes(),
  //     this.attributes.isInitialized !== false || (this.attributes.isInitialized = true));
  //   this.isInitialized === false &&
  //     (this.initialize(), this.isInitialized !== false || (this.isInitialized = true));
  // }

  attributeChangedCallback(attributeName, previousValue, nextValue) {
    previousValue === nextValue ||
      previousValue == nextValue ||
      typeof this.updateAttribute !== 'function' ||
      this.updateAttribute(attributeName, nextValue, previousValue);
  }

  // initializeAttributes() {
  //   const {defaultAttributes, isInitialized} = this.attributes;
  //   if (!isInitialized && defaultAttributes) {
  //     this.attributes.isInitialized = true;
  //     for (const attribute in defaultAttributes) {
  //       this.updateAttribute(attribute, this[attribute]);
  //     }
  //   }
  // }

  trace(detail, context = (detail && detail.target) || this, ...args) {
    const span = typeof context === 'string' ? '%s' : '%O';
    detail &&
      (detail.preventDefault
        ? console.log(`${span}â€¹%sâ€º %O`, context, detail.type, detail, ...args)
        : console.trace(`${span} %O`, context, detail, ...args));
  }
}

ResolvedPromise = Promise.resolve();

Component.Reactions = class extends Component {
  static get [DescriptorsSymbol]() {
    const {constructor, ...descriptors} = Object.getOwnPropertyDescriptors(this.prototype);
    return descriptors;
  }

  /**
   * @template T
   * @param {typeof Component} constructor
   * @param {Attributes<T>} component
   */
  static createAttributesDescriptors(constructor, attributes) {
    const {
      prototype,
      attributes: {
        [DescriptorsSymbol]: previousDescriptors,
      } = (constructor.attributes = attributes = Attributes.from(attributes)),
    } = constructor;

    if (previousDescriptors) return previousDescriptors;

    const descriptors = (attributes.descriptors = {});

    for (const attribute of attributes) {
      prototype.hasOwnProperty(attribute) ||
        Object.defineProperty(
          prototype,
          attribute,
          (descriptors[attribute] = {
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
          }),
        );
    }

    return descriptors;
  }

  /**
   * @template {typeof Component} T
   * @param {T} constructor
   * @param {InstanceType<T>} component
   */
  static construct(constructor, component) {
    const {prototype, attributes, template, shadowRoot} = constructor;
    const {callbacks = {}} = component;

    ({connectedCallback: callbacks.connectedCallback = prototype.connectedCallback, disconnectedCallback: callbacks.disconnectedCallback = prototype.disconnectedCallback} = component);

    Object.defineProperties(component, this.descriptors);
    const state = {component, constructor, prototype, callbacks};
    const reactions = component.reactions(state);
    Object.defineProperties(component, {
      reactions: {value: (reactions.state = state).reactions = reactions},
      callbacks: {value: callbacks},
    });

    const root = (state.root =
      /** @type {ShadowRoot} */
      ((shadowRoot && (shadowRoot === 'closed' && host.attachShadow({mode: 'closed'}))) ||
      ((shadowRoot === true || shadowRoot === 'open') && host.attachShadow({mode: 'open'})) ||
      (typeof shadowRoot === 'object' && 'mode' in shadowRoot && host.attachShadow(shadowRoot)) ||
      host));

    const initializing = [
      (state.attached = reactions.next({reaction: 'attached', when: 'connectedCallback'})),
    ];

    if (template) {
      /** @type {DocumentFragment} */
      const fragment = (state.fragment = (template.content || template).cloneNode(true));

      for (const element of fragment.querySelectorAll('[id]')) {
        this[`#${element.id}`] = element;
      }

      initializing.push(
        (state.fragmentInitialized = fragment.initialized = reactions.next({
          action: 'initializeFragment',
          reaction: 'fragmentInitialized',
          when: state.attached,
        })),
      );
      // root.append(fragment);
      // this.isInitialized = !('initialize' in this && typeof this.initialize === 'function');
      // root.hidden = true;
    }

    if (attributes) {
      hasOwnProperty((state.attributes = attributes), DescriptorsSymbol) ||
        this.createAttributesDescriptors(constructor, attributes);
      initializing.push(
        (reactions.attributesInitialized = reactions.next({
          action: 'initializeAttributes',
          reaction: 'attributesInitialized',
          when: 'fragmentInitialized',
        })),
      );
      this.attributes[DefaultsSymbol] = attributes;
    }

    reactions.initialized = reactions.fragmentInitialized = reactions.next({
      reaction: 'initialized',
      when: ['attached', 'attributesInitialized', 'fragmentInitialized'],
    });
  }

  get connectedCallback() {
      return this.callbacks.connectedCallback;
  }

  set connectedCallback(value) {
    return this.callbacks.connectedCallback = value;
  }

  get disconnectedCallback() {
    return this.callbacks.disconnectedCallback;
  }

  set disconnectedCallback(value) {
    return this.callbacks.disconnectedCallback = value;
  }

  /** @param {Component | ShadowRoot} root @param {DocumentFragment} [fragment] */
  async initializeRoot(root, fragment) {
    fragment && root.append(fragment);
    !super.initializeRoot || (await super.initializeRoot(root));
  }

  async initializeAttributes({attributes, initializeAttributes}) {
    if (typeof this.updateAttribute === 'function') {
      for (const attribute in attributes) {
        this.updateAttribute(attribute, this[attribute]);
      }
    } else {
      for (const attribute in attributes) {
        const defaultValue = attributes[attribute];
        defaultValue === undefined ||
          defaultValue === null ||
          this.hasAttribute(attribute) ||
          this.setAttribute(attribute, defaultValue);
      }
    }
    super.initializeAttributes && (await super.initializeAttributes());
  }


  /** @param {typeof this} constructor @param {{}} state */
  async *reactions(constructor, state) {
    // const {
    //   prototype,
    //   attributes,
    //   template,
    //   shadowRoot,
    //   reactions = (this.reactions = {
    //     attributes: (attributes && attributes.length) || (false && 'initializeAttributes'),
    //     element: 'initialize',
    //   }),
    // } = constructor;
    // const actions = [];
    // ({
    //   attributes: actions.attributes = (reactions.attributes = attributes &&
    //     attributes.length = 'initializeAttributes'),
    //   element: initializeElement = !(reactions.element =
    //     'initialize' in prototype && typeof prototype.initialize === 'function'),
    // } = reactions);
    // for (const reaction of reactions) {
    // }
    // }
  }

  // async connectedCallback() {
  //   await this.reactions.next('connectedCallback');
  //   !super.connectedCallback || super.connectedCallback();
  // }

  // async disconnectedCallback() {
  //   !super.disconnectedCallback || super.disconnectedCallback();
  //   await this.reactions.next('disconnectedCallback');
  // }

};
