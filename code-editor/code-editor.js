export * from './element.js';
export * from './model.js';

// import {html, Toggle} from './helpers.js';
// // import {Model} from './model.js';

// const base = `${new URL('./', import.meta.url)}`;
// const local = specifier => `${new URL(specifier, base)}`;

// const component = {
//   shadowRoot: true,
//   template: html`
//     <style>
//       @import '${local('./styles.css')}';
//     </style>
//     <div id="wrapper" class="codeflask">
//       <textarea id="textarea" class="codeflask__textarea codeflask__flatten"> </textarea>
//       <pre id="pre" class="codeflask__pre codeflask__flatten">
//         <code id="code" class="codeflask__code language-html"></code>
//       </pre>
//       <div id="linenumbers" class="codeflask__lines"></div>
//     </div>
//   `,
//   observedAttributes: ['direction', 'tabsize', 'autocorrect', 'linenumbers', 'readonly'],
//   defaults: {
//     tabsize: 2,
//     autocorrect: false,
//     linenumbers: true,
//     readonly: false,
//   },
// };

// export class CodeEditor extends HTMLElement {
//   constructor() {
//     /** @type {this} */
//     const host = super();

//     const constructor = new.target;
//     const {prototype, observedAttributes, template, shadowRoot, defaults} = constructor;

//     if (observedAttributes && observedAttributes.length) {
//       for (const attribute of observedAttributes) {
//         prototype.hasOwnProperty(attribute) ||
//           Object.defineProperty(this, attribute, {
//             get() {
//               return this.getAttribute(attribute);
//             },
//             set(value) {
//               value === null || value === undefined
//                 ? this.removeAttribute(attribute)
//                 : value === this.getAttribute(attribute) || this.setAttribute(attribute, value);
//             },
//           });
//       }
//     }

//     this.attributes.defaults = defaults;

//     const root =
//       /** @type {ShadowRoot} */
//       (shadowRoot && (shadowRoot === 'closed' && host.attachShadow({mode: 'closed'}))) ||
//       ((shadowRoot === true || shadowRoot === 'open') && host.attachShadow({mode: 'open'})) ||
//       (typeof shadowRoot === 'object' && 'mode' in shadowRoot && host.attachShadow(shadowRoot)) ||
//       host;

//     if (template) {
//       /** @type {DocumentFragment} */
//       const fragment = (template.content || template).cloneNode(true);
//       for (const element of fragment.querySelectorAll('[id]')) {
//         this[`#${element.id}`] = element;
//       }
//       root.append(fragment);
//     }
//   }

//   connectedCallback() {
//     const defaults = this.attributes.defaults;
//     if (defaults) {
//       this.attributes.defaults = undefined;
//       for (const attribute in defaults) {
//         this.hasAttribute(attribute) || this.setAttribute(attribute, defaults[attribute]);
//       }
//     }
//   }

//   attributeChangedCallback(attributeName, previousValue, nextValue) {
//     if (previousValue !== nextValue && previousValue != nextValue) {
//       switch (attributeName.toLowerCase()) {
//         case 'direction':
//           return void this.updateDirection(nextValue);
//         case 'readonly':
//           return void this.updateReadonly(nextValue);
//         case 'linenumbers':
//           return void this.updateLineNumbers(nextValue);
//         case 'autocorrect':
//           return void this.updateAutoCorrect(nextValue);
//         case 'tabsize':
//           return void this.updateTabSize(nextValue);
//       }
//     }
//   }

//   updateDirection(direction) {
//     this['#textarea'] && (this['#textarea'].dir = direction);
//   }

//   updateLineNumbers(lineNumbers) {
//     lineNumbers = lineNumbers === '' || Toggle(lineNumbers);
//     this['#linenumbers'] && (this['#linenumbers'].hidden = lineNumbers);
//     this['#wrapper'] &&
//       (lineNumbers
//         ? this['#wrapper'].classList.add('codeflask--has-line-numbers')
//         : this['#wrapper'].classList.remove('codeflask--has-line-numbers'));
//   }

//   updateReadonly(readonly) {
//     this['#textarea'] &&
//       (readonly === '' || Toggle(readonly)
//         ? this['#textarea'].setAttribute('readonly', '')
//         : this['#textarea'].removeAttribute('readonly'));
//   }

//   updateAutoCorrect(autoCorrect) {
//     this['#textarea'] &&
//       Object.assign(this['#textarea'], {
//         spellcheck: (autoCorrect = autoCorrect === '' || Toggle(autoCorrect)),
//         autocapitalize: autoCorrect,
//         autocomplete: autoCorrect,
//         autocorrect: autoCorrect,
//       });
//   }

//   updateTabSize(tabSize) {
//     this['#wrapper'] &&
//       this['#wrapper'].style.setProperty('--tab-size', (tabSize && tabSize > 0 && parseInt(tabSize)) || 'initial');
//   }
// }

// Object.assign(CodeEditor, component);

// try {
//   customElements.define('code-editor', CodeEditor);
// } catch (exception) {
//   console.warn(exception);
// }
