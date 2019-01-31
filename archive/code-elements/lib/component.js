// import {
//   hasOwn,
//   defineProperty,
//   getOwnPropertyDescriptor,
//   getOwnPropertyDescriptors,
//   freeze
// } from '../../lib/helpers.js';

// import {Attributes} from './attributes.js';


// export class Component extends HTMLElement {
//   /** @type {Attributes<string> | undefined} */
//   static get attributes() {}

//   static set attributes(value) {
//     value == null || !this || setAttributes(this, value);
//   }

//   /** @type {string[]} */
//   static get observedAttributes() {
//     return this.attributes;
//   }

//   static set observedAttributes(value) {
//     this === Component || updateProperty(this, 'observedAttributes', value);
//   }

//   /** @type {{mode: 'open' | 'closed'} | undefined} */
//   static get shadowRoot() {}

//   static set shadowRoot(value) {
//     this === Component || updateProperty(this, 'shadowRoot', value);
//   }

//   /** @type {DocumentFragment | undefined} */
//   static get template() {}

//   static set template(value) {
//     this === Component || updateProperty(this, 'template', value);
//   }
// }


// const setAttributes = (Class, attributes) => {
//   const descriptor = getOwnPropertyDescriptor(Class, 'attributes');
//   const ownAttributes = descriptor && Class.attributes;

//   if (attributes === ownAttributes || (!attributes && !ownAttributes)) return;
//   if (descriptor) {
//     throw ReferenceError(`Cannot change class attributes for ${Class.name}`);
//   }

//   const descriptors = {};

//   for (const attribute of attributes) {
//     descriptors[attribute] = Attributes.descriptorFor(attribute);
//   }

//   freeze(descriptors);
//   freeze(attributes);

//   defineProperties(Class, {
//     attributes: {
//       get() {
//         if (this === Class) return attributes;
//       },
//       set(value) {
//         value == null || !this || setAttributes(this, value);
//       },
//       configurable: false,
//       enumerable: true,
//     },
//     attributesDescriptors: {
//       value: descriptors, configurable: false, writable: false
//     },
//   });
//   return Class;
// };
