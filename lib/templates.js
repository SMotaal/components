//@ts-check
//@ts-ignore
import {components} from './components.js';

export {css} from './css.js';

/** @typedef {{raw: TemplateStringsArray['raw']}} RawStrings */
/** @typedef {TemplateStringsArray | RawStrings} TemplateStrings */

/**
 * @template T
 * @template V
 * @typedef {(strings: TemplateStrings, ...values: V[]) => T} TaggedTemplate
 */

/**
 * @template T
 * @typedef {TaggedTemplate<T, {toString(): string | void} | {} | void>} StringTaggedTemplate
 */

/** @type {StringTaggedTemplate<string>} */
export const raw = String.raw;

/**
 * @template T
 * @typedef {TaggedTemplate<T, {toString(): string | void} | DocumentFragment | HTMLElement | {} | void>} HTMLTaggedTemplate
 */

/** @returns {HTMLTaggedTemplate<HTMLTemplateElement>} */
export const template = (template = document.createElement('template')) => (strings, ...values) => {
  let index = 0;
  for (const value of values) {
    typeof value === 'string' ||
      (values[index] = `${value &&
        ('innerHTML' in value
          ? value.innerHTML
          : 'childNodes' in value && value.childNodes.length
          ? ((template.innerHTML = ''),
            template.content.appendChild(value.cloneNode(true)),
            template.innerHTML)
          : value)}`);
    index++;
  }
  template.innerHTML = raw(strings, ...values);
  return template;
};
template.html = template;

export const html = (template => {
  /** @type {HTMLTaggedTemplate<DocumentFragment>} */
  return (...args) => {
    const content = document.createDocumentFragment();
    content.appendChild(Reflect.apply(template, null, args).content);
    return content;
  };
})(template());

import.meta['components.template'] = components.template = template;
import.meta['components.html'] = components.html = html;

// /**
//  * @param {TemplateStringsArray | {raw: string[]}} strings
//  * @param {*} values
//  * @returns {string}
//  */
// export function css(strings, ...values) {
//   const source = raw(strings, ...values);
//   const style = source.replace(css.matcher, css.matcher.replacer);
//   console.log({style});
//   return style;
// }

// css.prefix = ['user-select'];
