//@ts-check
import {components} from './components.js';

export const styling = (() => {
  const styling = {};

  const {getOwnPropertyNames, setPrototypeOf, getPrototypeOf, freeze, keys} = Object;

  const {ELEMENT_NODE = 1, ATTRIBUTE_NODE = 2, DOCUMENT_FRAGMENT_NODE = 11} =
    (globalThis.Node && globalThis.Node.prototype) || {};

  /** @param {string} value @returns {string} */
  styling.autoprefix = value =>
    value.replace(styling.autoprefix.matcher, styling.autoprefix.replacer);

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

      const mapped = keys(mappings);

      if (mapped.length > 0) {
        styling.autoprefix.matcher = new RegExp(String.raw`\b-?(?:${mapped.join('|')})\b`, 'gi');
        freeze((styling.autoprefix.replacer = value => mappings[value] || value));
        freeze(styling.autoprefix.mappings);
        freeze(styling.autoprefix);
      }
    }
  }

  /** @param {string} value @param {string} property @returns {string} */
  styling.normalize = (value, property) => {
    if (!value || !(value = value.trim())) return '';
    value.startsWith('--') && !value.includes(' ') && (value = `var(${value}--${property}--)`);
    return value;
  };

  /** @param {HTMLElement} element @param {string} style */
  styling.mixin = (element, style) => {
    // TODO: Explore computedStyle mixins
    element.style.border = `var(--${style}--border--, unset)`;
    element.style.background = `var(--${style}--background--, unset)`;
    element.style.color = `var(--${style}--color--, unset)`;
    element.style.font = `var(--${style}--font--, unset)`;
    element.style.opacity = `var(--${style}--opacity--, unset)`;
  };

  /** @param {HTMLElement|DocumentFragment} node */
  styling.apply = node => {
    node == null ||
      typeof node !== 'object' ||
      (node.nodeType - DOCUMENT_FRAGMENT_NODE === 0
        ? // TODO: consider pseudom fragments
          styling.apply.toFragment(/** @type {DocumentFragment} */ (node))
        : // (node.nodeType - ELEMENT_NODE) === 0 &&
          styling.apply.toElement(/** @type {HTMLElement} */ (node)));
  };

  /** @param {HTMLElement} element */
  styling.apply.toElement = element => {
    // const {lookup, autoprefix, normalize} = styling;
    for (const attribute of element.getAttributeNames()) {
      attribute in styling.lookup &&
        (attribute === 'style:'
          ? styling.mixin(element, element.getAttribute(attribute))
          : styling.autoprefix === undefined
          ? (element.style[styling.lookup[attribute]] = styling.normalize(
              element.getAttribute(attribute),
              attribute.slice(0, -1),
            ))
          : (element.style[styling.lookup[attribute]] = styling.autoprefix(
              styling.normalize(element.getAttribute(attribute), attribute.slice(0, -1)),
            )),
        element.removeAttribute(attribute));
    }
  };

  /** @param {DocumentFragment} fragment */
  styling.apply.toFragment = fragment => {
    // if (typeof styling.selector === 'string' && styling.selector !== '') return;
    for (const element of fragment.querySelectorAll(styling.selector))
      styling.apply.toElement(/** @type {HTMLElement} */ (element));
  };

  /** @type {{[name: string] : string}} */
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
      ...[
        // Webkit/Blink
        ...getOwnPropertyNames(style),
        // Firefox
        ...getOwnPropertyNames(getPrototypeOf(style)),
      ].filter(property => style[property] === ''),
      // ].filter(property => style[property] === '' && Filter.test(property)),
    ])) {
      const attribute = `${property.replace(Boundary, '$&-').toLowerCase()}:`.replace(Prefix, '');
      styling.lookup[attribute] = property;
      selectors.push(`[${CSS.escape(attribute)}]`);
    }

    styling.selector = selectors.join(',');
  }
  freeze(setPrototypeOf(styling.lookup, null));
  freeze(styling.apply.toElement);
  freeze(styling.apply.toFragment);
  freeze(styling.apply);

  freeze(styling);

  import.meta['components.styling'] = components.styling = styling;

  return styling;
})();
