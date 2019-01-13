// @ts-check

/** @typedef {{raw: TemplateStringsArray['raw']}} RawStrings */
/** @typedef {TemplateStringsArray | RawStrings} TemplateStrings */

/**
 * @template T
 * @typedef {(strings: TemplateStrings, ...values: ({toString(): string | void} | {} | void)[]) => T} TaggedTemplate
 */

/** @type {TaggedTemplate<string>} */
export const raw = String.raw;

/** @returns {TaggedTemplate<HTMLTemplateElement>} */
export const template = (template = document.createElement('template')) => (strings, ...values) => (
  (template.innerHTML = raw(strings, ...values)), template
);
template.html = template;

export const html = (template => {
  /** @type {TaggedTemplate<DocumentFragment>} */
  return (...args) => {
    const content = document.createDocumentFragment();
    content.appendChild(Reflect.apply(template, null, args).content);
    return content;
  };
})(template());


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
