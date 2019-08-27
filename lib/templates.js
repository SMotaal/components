//@ts-check
import {components} from './components.js';

export {css} from './css.js';

/** @type {StringTaggedTemplate<string>} */
export const raw = String.raw;

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
  return (import.meta['components.template'] = components.template = template);
};
template.html = template;

export const html = (template => {
  /** @type {HTMLTaggedTemplate<DocumentFragment>} */
  return (import.meta['components.html'] = components.html = (...args) => {
    //@ts-ignore
    (args.content = document.createDocumentFragment()).appendChild(
      Reflect.apply(template, null, args).content,
    );
    //@ts-ignore
    return args.content;
  });
})(template());

/** @typedef {{raw: TemplateStringsArray['raw']}} RawStrings */
/** @typedef {TemplateStringsArray | RawStrings} TemplateStrings */

/** @template T, V @typedef {(strings: TemplateStrings, ...values: V[]) => T} TaggedTemplate */

/** @template T @typedef {TaggedTemplate<T, {toString(): string | void} | {} | void>} StringTaggedTemplate */
/** @template T @typedef {TaggedTemplate<T, {toString(): string | void} | DocumentFragment | HTMLElement | {} | void>} HTMLTaggedTemplate */
