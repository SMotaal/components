//@ts-check
import {components} from './components.js';

export const DefaultAttributes = 'defaultAttributes';
export const IsInitialized = 'isInitialized';
export const Loaded = 'loaded';
export const COMPONENT_LOADING_VISIBILITY = 'hidden !important';

export const Component = (() => {
  const {
    HTMLElement = (() => /** @type {HTMLElementConstructor} */ (class HTMLElement {}))(),
  } = globalThis;

  class Component extends HTMLElement {
    constructor() {
      /** @typedef {this} element */
      /** @type {ComponentStyleElement} */
      let style;
      /** @type {DocumentFragment} */
      let fragment;
      /** @type {(this | ShadowRoot)} */
      let root;

      super();

      root = new.target.shadowRoot ? this.attachShadow(new.target.shadowRoot) : this;

      //@ts-ignore
      fragment = new.target.template
        ? new.target.template.cloneNode(true)
        : root !== this || document.createDocumentFragment();

      if (new.target.styles) {
        root === this && (this.style.visibility = COMPONENT_LOADING_VISIBILITY);
        // this.style.visibility = COMPONENT_LOADING_VISIBILITY;
        (fragment || root).prepend((style = initializeComponentStyles(this, new.target)));
      }

      if (new.target.attributes && new.target.attributes.length) {
        this.attributes[DefaultAttributes] = initializeComponentAttributes(this, new.target);
        this.attributes[IsInitialized] = false;
      }

      if (new.target.template) {
        for (const element of fragment.querySelectorAll('[id]')) this[`#${element.id}`] = element;
        for (const element of fragment.querySelectorAll('slot'))
          `::${element.name || ''}` in this || (this[`::${element.name || ''}`] = element);
      }

      new.target.initializeRoot(this, fragment, style, root);
    }

    connectedCallback() {
      this.attributes[IsInitialized] === false && this.initializeAttributes();
    }

    attributeChangedCallback(attributeName, previousValue, nextValue) {
      previousValue === nextValue ||
        previousValue == nextValue ||
        (typeof this.updateAttribute === 'function'
          ? this.updateAttribute(attributeName, nextValue, previousValue)
          : attributeName in this && (this[attributeName] = nextValue));
    }

    initializeAttributes() {
      const attributes = this.attributes;
      if (!attributes[IsInitialized] && attributes[DefaultAttributes]) {
        attributes[IsInitialized] = true;
        for (const attribute in attributes[DefaultAttributes])
          this.updateAttribute(attribute, this[attribute]);
      }
    }

    trace(detail, context = (detail && detail.target) || this, ...args) {
      const span = typeof context === 'string' ? '%s' : '%O';
      detail &&
        (detail.preventDefault
          ? console.log(`${span}‹%s› %O`, context, detail.type, detail, ...args)
          : console.trace(`${span} %O`, context, detail, ...args));
    }

    static async initializeRoot(host, fragment, style, root) {
      // Upgrade shadow root prototype from ‹this Component›.Root
      //  TODO: Chaining Component.Root inheritance via setter
      'Root' in this &&
        root !== host &&
        typeof this.Root === 'function' &&
        this.Root.prototype instanceof ShadowRoot &&
        Object.setPrototypeOf(root, this.Root.prototype);

      //@ts-ignore
      style && root === host && (await new Promise(setTimeout));
      fragment && root.append(fragment);

      // Attach host['(on…)'] listeners against the shadow root
      //  TODO: Attaching host['(on…)'] listeners without shadow root.
      if (typeof root['(onevent)'] === 'function') {
        const options = {passive: false};
        for (const property in host.constructor.prototype) {
          if (
            typeof property === 'string' &&
            typeof host[`(${property})`] === 'function' &&
            property.startsWith('on')
          ) {
            root[`(${property})`] = host[`(${property})`];
            root.addEventListener(property.slice(2), root['(onevent)'], options);
          }
        }
      }

      style && (await style.loaded);

      host.style.visibility === COMPONENT_LOADING_VISIBILITY && (host.style.visibility = '');
    }
  }

  const {defineProperty} = Object;

  /**
   * @template {typeof Component} C
   * @param {InstanceType<C>} component
   * @param {C} constructor
   */
  const initializeComponentAttributes = (component, constructor) => {
    const {prototype, attributes: componentAttributes} = constructor;
    for (const attribute of componentAttributes) {
      prototype.hasOwnProperty(attribute) ||
        defineProperty(this, attribute, {
          get() {
            return this.hasAttribute(attribute)
              ? this.getAttribute(attribute)
              : componentAttributes[attribute];
          },
          set(value) {
            value === null || value === undefined
              ? this.removeAttribute(attribute)
              : value === this.getAttribute(attribute) || this.setAttribute(attribute, value);
          },
        });
    }
    return componentAttributes;
  };

  const StyleElement = Symbol('styles.element');

  /**
   * @template {typeof Component} C
   * @param {InstanceType<C>} component
   * @param {C} constructor
   */
  const initializeComponentStyles = (component, constructor) => {
    /** @type {ComponentStyleElement} */
    const componentStyleElement =
      constructor[StyleElement] ||
      (constructor.styles &&
        (constructor[StyleElement] = createComponentStyleElement(constructor.styles)));

    if (componentStyleElement) return componentStyleElement.cloneStyleSheet();
  };

  /** @param {string} textContent */
  const createComponentStyleElement = textContent => {
    /** @type {ComponentStyleElement} */
    const style = document.createElement('style');

    style.loaded = new Promise(resolve => {
      const handler = event => {
        style.removeEventListener('load', handler);
        style.removeEventListener('error', handler);
        style.removeEventListener('abort', handler);
        resolve();
      };
      style.addEventListener('load', handler, {capture: true, passive: false, once: true});
      style.addEventListener('error', handler, {capture: true, passive: false, once: true});
      style.addEventListener('abort', handler, {capture: true, passive: false, once: true});
    });

    style.cloneStyleSheet = () => {
      /** @type {any} */
      const clone = style.cloneNode(true);
      clone.loaded = style.loaded;
      return clone;
    };

    style.textContent = textContent;

    return style;
  };

  {
    const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
    const {defineProperty, defineProperties, getOwnPropertyDescriptor} = Object;

    const {
      ShadowRoot: Root = (() => /** @type {globalThis['ShadowRoot']} */ (class ShadowRoot {}))(),
    } = globalThis;

    Component.Root = class Root extends ShadowRoot {
      ['(onevent)'](event) {
        return `(on${event.type})` in this
          ? this[`(on${event.type})`].call(this.host || this, event)
          : undefined;
      }
    };

    /**
     * @template {PropertyKey} K
     * @template V
     * @param {{}} target
     * @param {K} property
     * @param {V} value
     */
    const updateProperty = (target, property, value) => (
      !target ||
        !property ||
        ((!hasOwnProperty(target, property) ||
          getOwnPropertyDescriptor(target, property).configurable !== false) &&
          defineProperty(target, property, {
            get: () => value,
            set: value => updateProperty(target, property, value),
            configurable: true,
          })),
      target
    );

    const descriptor = {get: () => undefined, enumerable: true, configurable: true};

    defineProperties(Component, {
      set: {
        value: {
          /** @template T @param {PropertyKey} property @param {T} value */
          set(property, value) {
            updateProperty(this, property, value);
            return value;
          },
        }.set,
      },
      attributes: {
        set(value) {
          updateProperty(this, 'attributes', value);
        },
        ...descriptor,
      },
      observedAttributes: {
        set(value) {
          updateProperty(this, 'observedAttributes', value);
        },
        ...descriptor,
      },
      shadowRoot: {
        set(value) {
          updateProperty(this, 'shadowRoot', value);
        },
        ...descriptor,
      },
      template: {
        set(value) {
          updateProperty(this, 'template', value);
        },
        ...descriptor,
      },
      styles: {
        set(value) {
          updateProperty(this, 'styles', value);
        },
        ...descriptor,
      },
      html: {
        set(value) {
          this === Component || updateProperty(this, 'html', value);
        },
        get() {
          return components.html;
        },
      },
      css: {
        set(value) {
          this === Component || updateProperty(this, 'css', value);
        },
        get() {
          return components.css;
        },
      },
      styling: {
        set(value) {
          this === Component || updateProperty(this, 'styling', value);
        },
        get() {
          return components.styling;
        },
      },
      Attributes: {
        set(value) {
          this === Component || updateProperty(this, 'Attributes', value);
        },
        get() {
          return components.Attributes;
        },
      },
      Assets: {
        set(value) {
          this === Component || updateProperty(this, 'Assets', value);
        },
        get() {
          return components.Assets;
        },
      },
    });
  }

  if (void Component) {
    /** @type {<T>(property:PropertyKey, value: T) => T} */
    Component.set = undefined;

    /** @type {import('./attributes').Attributes<string> | undefined} */
    Component.attributes = undefined;

    /** @type {string[]} */
    Component.observedAttributes = undefined;

    /** @type {ShadowRootInit} */
    Component.shadowRoot = undefined;

    /** @type {DocumentFragment} */
    Component.template = undefined;

    /** @type {string} */
    Component.styles = undefined;

    // Those properties are meant for bundling
    /** @type {import('./templates.js')['css']} */
    Component.html = components.html;
    /** @type {import('./templates.js')['html']} */
    Component.css = components.css;
    /** @type {import('./styling.js')['styling']} */
    Component.styling = components.styling;
    /** @type {import('./assets.js')['Assets']} */
    Component.Assets = components.Assets;
    /** @type {import('./attributes.js')['Attributes']} */
    Component.Attributes = components.Attributes;

    /** @type {<T, R, U>(attributeName: string, nextValue?: T, previousValue?: T | R) => U} */
    Component.prototype.updateAttribute = undefined;
  }

  return Component;
})();

/** @typedef {typeof HTMLElement} HTMLElementConstructor */
/** @typedef {import('./attributes')['Attributes']} Attributes */
/** @typedef {HTMLStyleElement & Partial<{cloneStyleSheet(): ComponentStyleElement, loaded?: Promise<void>}>} ComponentStyleElement */
