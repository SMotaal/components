// import {
//   hasOwn,
//   defineProperty,
//   getOwnPropertyDescriptor,
//   getOwnPropertyDescriptors,
//   freeze
// } from '../../lib/helpers.js';


/**
 * @template {string} K
 * @extends {Array<K>}
 */
export class Attributes extends Array {
  /**
   * @param {{[index: number]:K} | {[name: K]}} attributes
   */
  constructor(attributes) {
    const names =
      (attributes &&
        ((Symbol.iterator in attributes && attributes) ||
          Object.getOwnPropertyNames(attributes))) ||
      '';
    super(...names);
    !attributes || names === attributes || Object.assign(this, attributes);
  }

  *entries() {
    for (const key of super[Symbol.iterator]()) {
      yield [key, this[key]];
    }
  }

  /**
   * @template {string} K
   * @template {{[name: K]}} T
   * @param {...T} definitions
   * @returns {Attributes<K> | T}
   */
  static from(...definitions) {
    const attributes = {};

    for (const object of definitions) {
      for (const name of Symbol.iterator in object ? object : Object.getOwnPropertyNames(object)) {
        typeof name !== 'string' ||
          (name in attributes
            ? // Assign to undefined default
              attributes[name] === undefined || (attributes[name] = object[name])
            : // Add name to the set of names and initialize default
              (attributes[name] = object[name]));
      }
    }

    // return Object.assign(new this(...names), defaults);
    return new this(attributes);
  }

  static descriptorFor(attribute) {
    return (
      Attributes.descriptors[attribute] ||
      (Attributes.descriptors[attribute] = {
        get() {
          return this.hasAttribute(attribute)
            ? this.getAttribute(attribute)
            : attributes[attribute];
        },
        set(value) {
          value === null || value === undefined
            ? this.removeAttribute(attribute)
            : value === this.getAttribute(attribute) || this.setAttribute(attribute, value);
        },
      })
    );
  }

}

Attributes.descriptors = Object.create();

Object.defineProperties(Attributes.prototype, {
  [Symbol.toStringTag]: {value: 'Attributes'},
  [Symbol.isConcatSpreadable]: {value: false},
});
