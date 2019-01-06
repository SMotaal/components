export * from './globals.js';
export * from './templates.js';
export * from './events.js';
export * from './attributes.js';
export * from './expressions.js';




// export * from './events.js';

// /**
//  * @argument {strings} strings
//  * @argument {... values} values
//  * @returns {HTMLTemplateElement}
//  */
// export const template = (raw => (template = document.createElement('template')) => (
//   strings,
//   ...values
// ) => ((template.innerHTML = String.raw(strings, ...values)), template))(String.raw);

// template.html = template;

// /**
//  * @argument {strings} strings
//  * @argument {... values} values
//  * @returns {DocumentFragment}
//  */
// export const html = (template => (...args) => {
//   const content = document.createDocumentFragment();
//   content.appendChild(Reflect.apply(template, null, args).content);
//   return content;
// })(template());

// export const Toggle = (matcher => value =>
//   ((value !== null && value !== undefined && typeof value !== 'symbol') || undefined) &&
//   (value === true ||
//     value == true ||
//     (value !== false &&
//       value != false &&
//       (value = matcher.exec(value) || undefined) &&
//       !value[2])))(/\b(?:(true|on|yes)|(false|off|no))\b/i);

// export const CustomElementTag = /^[a-z][a-z0-9]+(-[a-z0-9]+)+$/i;

// export const ObservedAttributes = ()

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
