// @ts-check

/**
 * @template T
 * @typedef {(strings: TemplateStringsArray | {raw: string[]}, ...values: ({toString(): string | void} | {} | void)[]) => T} TaggedTemplate
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
