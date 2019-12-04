//@ts-check
import {components} from './components.js';

export const styling = (() => {
  /** @typedef {string} styling.Value */
  /** @typedef {string} styling.Property */
  /** @typedef {string} styling.Style */
  /** @typedef {HTMLElement} styling.Element */
  /** @typedef {Iterable<styling.Element>} styling.Elements */
  /** @typedef {DocumentFragment} styling.Fragment */
  /** @typedef {Iterable<styling.Fragment>} styling.Fragments */
  /** @typedef {styling.Element|styling.Fragment} styling.Node */
  /** @typedef {Record<string, any>} styling.Options */
  /** @typedef {Record<string, string>} styling.Lookup */

  const styling = {};

  const {ELEMENT_NODE = 1, ATTRIBUTE_NODE = 2, DOCUMENT_FRAGMENT_NODE = 11} =
    (globalThis.Node && globalThis.Node.prototype) || {};

  /**
   * @param {styling.Value} value
   * @param {styling.Options} [options]
   */
  styling.autoprefix = (value, options) => value.replace(styling.autoprefix.matcher, styling.autoprefix.replacer);

  {
    styling.autoprefix.mappings = {};
    styling.autoprefix.prefix = CSS.supports('-moz-appearance', 'initial')
      ? '-moz-'
      : CSS.supports('-webkit-appearance', 'initial')
      ? '-webkit-'
      : '';
    if (styling.autoprefix.prefix) {
      const {mappings, prefix} = styling.autoprefix;
      const map = (property, value, mapping = `${prefix}${value}`) =>
        CSS.supports(property, value) || (mappings[value] = mapping);

      if (prefix === '-webkit-') {
        map('width', 'fill-available');
      } else if (prefix === '-moz-') {
        map('width', 'fill-available', '-moz-available');
      }

      const mapped = Object.keys(mappings);

      if (mapped.length > 0) {
        styling.autoprefix.matcher = new RegExp(String.raw`\b-?(?:${mapped.join('|')})\b`, 'gi');
        Object.freeze((styling.autoprefix.replacer = value => mappings[value] || value));
        Object.freeze(styling.autoprefix.mappings);
        Object.freeze(styling.autoprefix);
      }
    }
  }

  /**
   * @param {styling.Value} value
   * @param {styling.Property} property
   * @param {styling.Options} [options]
   */
  styling.normalize = (value, property, options) => {
    if (!value || !(value = value.trim())) return '';
    value.startsWith('--') && !value.includes(' ') && (value = `var(${value}--${property}--)`);
    return value;
  };

  /**
   * @param {styling.Element} element
   * @param {styling.Style} style
   * @param {styling.Options} [options]
   */
  styling.mixin = (element, style, options) => {
    // TODO: Explore computedStyle mixins
    element.style.border = `var(--${style}--border--, unset)`;
    element.style.background = `var(--${style}--background--, unset)`;
    element.style.color = `var(--${style}--color--, unset)`;
    element.style.font = `var(--${style}--font--, unset)`;
    element.style.opacity = `var(--${style}--opacity--, unset)`;
  };

  /**
   * @param {styling.Node} node
   * @param {styling.Options} [options]
   */
  styling.apply = (node, options) => {
    node == null ||
      typeof node !== 'object' ||
      (node.nodeType - DOCUMENT_FRAGMENT_NODE === 0
        ? // TODO: consider pseudom fragments
          styling.apply.toFragment(/** @type {DocumentFragment} */ (node))
        : // (node.nodeType - ELEMENT_NODE) === 0 &&
          styling.apply.toElement(/** @type {HTMLElement} */ (node)));
  };

  /**
   * @param {styling.Element} element
   * @param {styling.Options} [options]
   */
  styling.apply.toElement = (element, options) => {
    // const {lookup, autoprefix, normalize} = styling;

    for (const attribute of element.getAttributeNames()) {
      if (attribute in styling.lookup) {
        attribute === 'style:'
          ? styling.mixin(element, element.getAttribute(attribute))
          : styling.autoprefix === undefined
          ? (element.style[styling.lookup[attribute]] = styling.normalize(
              element.getAttribute(attribute),
              attribute.slice(0, -1),
            ))
          : (element.style[styling.lookup[attribute]] = styling.autoprefix(
              styling.normalize(element.getAttribute(attribute), attribute.slice(0, -1)),
            ));
        element.removeAttribute(attribute);
      } else if (options && options.attributes && typeof options.attributes[attribute] === 'function') {
        options.attributes[attribute](
          element,
          attribute,
          styling.normalize(element.getAttribute(attribute), attribute.slice(0, -1)),
          options,
        );
      }
    }
  };

  /**
   * @param {styling.Fragment} fragment
   * @param {styling.Options} [options]
   */
  styling.apply.toFragment = (fragment, options) => {
    // if (typeof styling.selector === 'string' && styling.selector !== '') return;
    for (const element of /** @type {Iterable<styling.Element>} */ (fragment.querySelectorAll(styling.selector)))
      styling.apply.toElement(element, options);
  };

  /** @type {styling.Lookup} */
  styling.lookup = {};

  {
    const selectors = [];
    const style = document.createElement('span').style;
    const Prefix = /^-?webkit-|-?moz-/;
    const Filter = /^(?!webkit[A-Z])(?!moz[A-Z])[A-Za-z]{2,}$/;
    const Boundary = /[a-z](?=[A-Z])/g;

    for (const property of new Set([
      // Markout style properties
      'style', // mixin styling
      // CSS style properties
      ...Object.getOwnPropertyNames(
        Object.getOwnPropertyDescriptor(style, 'backgroundColor')
          ? // Webkit/Blink  et al
            style
          : // Firefox et al
            Object.getPrototypeOf(style),
      ).filter(property => style[property] === ''),
    ])) {
      const attribute = `${property.replace(Boundary, '$&-').toLowerCase()}:`.replace(Prefix, '');
      styling.lookup[attribute] = property;
      selectors.push(`[${CSS.escape(attribute)}]`);
    }

    styling.selector = selectors.join(',');
  }

  Object.freeze(Object.setPrototypeOf(styling.lookup, null));
  Object.freeze(styling.apply.toElement);
  Object.freeze(styling.apply.toFragment);
  Object.freeze(styling.apply);

  Object.freeze(styling);

  import.meta['components.styling'] = components.styling = styling;

  return styling;
})();
