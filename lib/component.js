//@ts-check
import {components} from './components.js';

export const DefaultAttributes = 'defaultAttributes';
export const IsInitialized = 'isInitialized';
export const Loaded = 'loaded';
export const COMPONENT_LOADING_VISIBILITY = 'hidden !important';

export const Component = (() => {
  const {HTMLElement = (() => /** @type {HTMLElementConstructor} */ (class HTMLElement {}))()} = globalThis;

  class Component extends HTMLElement {
    constructor() {
      /** @type {ComponentStyleElement} */ let style;
      /** @type {DocumentFragment}      */ let fragment;
      /** @type {(this | ShadowRoot)}   */ let root;

      super();

      root = new.target.shadowRoot ? this.attachShadow(new.target.shadowRoot) : this;

      fragment = new.target.template
        ? /** @type {DocumentFragment} */ (new.target.template.cloneNode(true))
        : root === this && this.ownerDocument.createDocumentFragment();

      if (new.target.styles) {
        root === this && ComponentStyle.setLoadingVisibility(this, false);
        (fragment || root).prepend((style = ComponentStyle.for(this, new.target)));
      }

      if (new.target.attributes && new.target.attributes.length)
        ComponentAttributes.initializeComponent(this, new.target);

      if (new.target.template) {
        for (const element of fragment.querySelectorAll('[id]')) this[`#${element.id}`] = element;
        for (const element of fragment.querySelectorAll('slot'))
          `::${element.name || ''}` in this || (this[`::${element.name || ''}`] = element);
      }

      new.target.initializeRoot(this, fragment, style, root);

      fragment = style = root = null;
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
      ComponentAttributes.initializeAttributes(this);
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

      style && style.loaded && (await style.loaded);
      ComponentStyle.setLoadingVisibility(host, true);
    }
  }

  const {defineProperty} = Object;

  /**
   * TODO: Define behaviours for ComponentStyles instances
   *  SEE: https://wicg.github.io/construct-stylesheets/
   */
  class ComponentAttributes {
    /**
     * @template {typeof Component} C
     * @param {InstanceType<C>} component
     * @param {C} constructor
     */
    static initializeComponent(component, constructor) {
      const {prototype, attributes: componentAttributes} = constructor;
      for (const attribute of componentAttributes) {
        prototype.hasOwnProperty(attribute) ||
          defineProperty(this, attribute, {
            get() {
              return this.hasAttribute(attribute) ? this.getAttribute(attribute) : componentAttributes[attribute];
            },
            set(value) {
              value === null || value === undefined
                ? this.removeAttribute(attribute)
                : value === this.getAttribute(attribute) || this.setAttribute(attribute, value);
            },
          });
      }

      component[ComponentAttributes.DEFAULTS] = componentAttributes;
      component[ComponentAttributes.INITIALIZED] = false;
    }

    static initializeAttributes(component) {
      if (component && !component[ComponentAttributes.INITIALIZED] && component[ComponentAttributes.DEFAULTS]) {
        component[ComponentAttributes.INITIALIZED] = true;
        if (typeof component.updateAttribute === 'function') {
          for (const attribute in component[ComponentAttributes.DEFAULTS])
            component.updateAttribute(attribute, this[attribute]);
        } else {
          console.warn('ComponentAttributes invoked on an unsupported component: %O', component);
        }
      }
    }
  }

  ComponentAttributes.DEFAULTS = Symbol('attributes.defaults');
  ComponentAttributes.INITIALIZED = Symbol('attributes.initialized');

  /**
   * TODO: Define behaviours for ComponentStyles instances
   *  SEE: https://wicg.github.io/construct-stylesheets/
   */
  class ComponentStyle {
    /**
     * @param {Component} component
     * @param {boolean} [visibility] - Defaults relative to having --component-loading-visiblity--
     */
    static setLoadingVisibility(component, visibility) {
      if (visibility == null) visibility = !!component.style.getPropertyValue('--component-loading-visiblity--');
      if (visibility == false) {
        component.style.setProperty('--component-loading-visiblity--', 'hidden');
        component.style.visibility = `var(--component-loading-visiblity--${
          component.style.visibility ? `, ${component.style.visibility}` : ''
        }) !important`;
      } else if (visibility == true) {
        component.style.removeProperty('--component-loading-visiblity--');
        if (component.style.visibility.includes('--component-loading-visiblity--'))
          component.style.visibility = /^\s*var\s*\(\s*--component-loading-visiblity--\s*(?:,\s*)?(.*)\).*?$/[
            Symbol.replace
          ](component.style.visibility, '$1');
      } else {
        console.warn(`ComponentStyle.setLoadingVisibility invoked invalid visibility: %O`, visibility);
      }
    }

    /**
     * @template {typeof Component} C
     * @param {InstanceType<C>} component
     * @param {C} constructor
     */
    static for(component, constructor) {
      /** @type {ComponentStyleElement} */
      const componentStyleElement =
        constructor[ComponentStyle.ELEMENT] ||
        (constructor.styles &&
          (constructor[ComponentStyle.ELEMENT] =
            // /** @type {typeof ComponentStyle} */ (
            // (this !== undefined && ComponentStyle.isPrototypeOf(this) && this) ||
            // ComponentStyle
            // )

            ComponentStyle.createStyleElement(constructor.styles, component.ownerDocument)));

      if (componentStyleElement) return componentStyleElement.cloneStyleSheet();
    }

    /**
     * @param {string} textContent
     * @param {Document} [ownerDocument = document]
     * @param {boolean} [strict]
     * @throws - Where `!!strict` when `style.ownerDocument !== ownerDocument`
     * @throws - Where `!!strict` when `style.nodeName !== "STYLE"`
     */
    static createStyleElement(textContent, ownerDocument, strict) {
      let nodeName, nodeOwnerDocument;

      if (ownerDocument == null) ownerDocument = document;

      /** @type {ComponentStyleElement} */
      const style = ownerDocument.createElement('style');

      ({nodeName, ownerDocument: nodeOwnerDocument} = style);

      if (ownerDocument !== nodeOwnerDocument || nodeName !== 'STYLE') {
        const details = {
          style,
          ...(nodeOwnerDocument !== ownerDocument && {
            '{ownerDocument} actual': nodeOwnerDocument,
            '{ownerDocument} expected': ownerDocument,
          }),
          ...(nodeName !== 'STYLE' && {
            '{nodeName} actual': nodeName,
            '{nodeName} expected': 'STYLE',
          }),
        };

        if (!strict) {
          console.warn('Potentially unsafe <style> creation: %O', details);
        } else {
          throw Object.assign(
            Error(
              [
                'Unsafe <style> element creation',
                ownerDocument !== nodeOwnerDocument && 'mismatching ownerDocument and <style>.ownerDocument.',
                nodeName !== 'STYLE' && '<style>.nodeName !== "STYLE".',
              ]
                .filter(Boolean)
                .join(' - '),
            ),
            {details},
          );
        }
      }

      style.loaded = new Promise(resolve => {
        const handler = event => {
          for (const event of ['load', 'error', 'abort']) style.removeEventListener(event, handler);
          resolve();
        };
        handler.options = {capture: true, passive: false, once: true};
        for (const event of ['load', 'error', 'abort']) style.addEventListener(event, handler, handler.options);
      });

      style.cloneStyleSheet = () => {
        /** @type {any} */
        const clone = style.cloneNode(true);
        clone.loaded = style.loaded;
        return clone;
      };

      style.textContent = textContent;

      return style;
    }
  }

  ComponentStyle.ELEMENT = Symbol('style.element');

  {
    // const {
    //   ShadowRoot: Root = (() => /** @type {typeof ShadowRoot} */ (class ShadowRoot {}))(), // Polyfill as needed
    // } = globalThis;

    Component.Root = class Root extends ShadowRoot {
      ['(onevent)'](event) {
        return `(on${event.type})` in this ? this[`(on${event.type})`].call(this.host || this, event) : undefined;
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
        ((!Object.prototype.hasOwnProperty.call(target, property) ||
          Object.getOwnPropertyDescriptor(target, property).configurable !== false) &&
          Object.defineProperty(target, property, {
            get: () => value,
            set: value => updateProperty(target, property, value),
            configurable: true,
          })),
      target
    );

    const descriptor = {get: () => undefined, enumerable: true, configurable: true};

    Object.defineProperties(Component, {
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
    Component.css = components.css;
    /** @type {import('./templates.js')['html']} */
    //@ts-ignore
    Component.html = components.html;
    /** @type {import('./styling.js')['styling']} */
    Component.styling = components.styling;
    /** @type {import('./assets.js')['Assets']} */
    Component.Assets = components.Assets;
    /** @type {import('./attributes.js')['Attributes']} */
    Component.Attributes = components.Attributes;

    /** @type {<T, R, U>(attributeName: string, nextValue?: T, previousValue?: T | R) => U} */
    Component.prototype.updateAttribute = undefined;

    /** @type {{(): void}} */
    Component.prototype.disconnectedCallback = undefined;
  }

  return Component;
})();

/** @typedef {typeof HTMLElement} HTMLElementConstructor */
/** @typedef {import('./attributes')['Attributes']} Attributes */
/** @typedef {HTMLStyleElement & Partial<{cloneStyleSheet(): ComponentStyleElement, loaded?: Promise<void>}>} ComponentStyleElement */
