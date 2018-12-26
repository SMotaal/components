/**
 * @argument {strings} strings
 * @argument {... values} values
 * @returns {HTMLTemplateElement}
 */
export const template = (raw => (template = document.createElement('template')) => (strings, ...values) => (
  (template.innerHTML = String.raw(strings, ...values)), template
))(String.raw);

template.html = template;

/**
 * @argument {strings} strings
 * @argument {... values} values
 * @returns {DocumentFragment}
 */
export const html = (template => (...args) => {
  const content = document.createDocumentFragment();
  content.appendChild(Reflect.apply(template, null, args).content);
  return content;
})(template());


// export const Events = {
//   Click: 'click',
//   Focus: 'focus',
//   Keypress: 'keypress',
//   Blur: 'blur',
//   BeforePaste: 'beforepaste',
//   BeforeCut: 'beforecut',
//   FocusIn: 'focusin',
//   FocusOut: 'focusout',
//   BeforeInput: 'beforeinput',
//   Input: 'input',
//   CompositionStart: 'compositionstart',
//   CompositionUpdate: 'compositionupdate',
//   CompositionEnd: 'compositionend',
// };


/**
 * @typedef {{raw: string[]}} strings // {{raw: string[]} | string[]} strings
 * @typedef {{toString(): string | void} | {} | void} stringifiable
 * @typedef {(stringifiable)[]} values //  | Promise<stringifiable>
 */
