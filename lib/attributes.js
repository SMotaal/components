//@ts-check
//@ts-ignore
import {components} from './components.js';

export const {Toggle, Attributes} = (() => {
  const {assign, defineProperties, getOwnPropertyNames} = Object;

  /**
   * @template T
   * @param {T} value
   * @returns {attribute.toggle<T>}
   */
  const Toggle = (matcher => value =>
    ((value !== null && value !== undefined && typeof value !== 'symbol') || undefined) &&
    (value === true ||
      value == true ||
      ((value !== '' || '') &&
        ((value !== false && value != false) || false) &&
        (value = matcher.exec(value) || undefined) &&
        (value[1] ? true : value[2] ? false : undefined))))(
    /\b(?:(true|on|yes)|(false|off|no))\b/i,
  );

  /**
   * @template {string} K
   * @extends {Array<K>}
   */
  class Attributes extends Array {
    //@ts-ignore
    /** @param {{[index: number]:K} | {[name: K]}} attributes */
    constructor(attributes) {
      const names =
        (attributes &&
          ((Symbol.iterator in attributes && attributes) || getOwnPropertyNames(attributes))) ||
        '';
      //@ts-ignore
      super(...names);
      !attributes || names === attributes || assign(this, attributes);
    }

    //@ts-ignore
    *entries() {
      for (const key of super[Symbol.iterator]()) {
        //@ts-ignore
        yield [key, this[key]];
      }
    }

    /**
     * @template {string} K
     //@ts-ignore
     * @template {{[name: K]}} T
     * @param {...T} definitions
     * @returns {Attributes<K> | T}
     */
    static from(...definitions) {
      const attributes = {};

      for (const object of definitions) {
        //@ts-ignore
        for (const name of Symbol.iterator in object ? object : getOwnPropertyNames(object)) {
          typeof name !== 'string' ||
            (name in attributes
              ? // Assign to undefined default
                attributes[name] === undefined || (attributes[name] = object[name])
              : // Add name to the set of names and initialize default
                (attributes[name] = object[name]));
        }
      }
      return new this(attributes);
    }
  }

  Attributes.Toggle = Toggle;

  defineProperties(Attributes.prototype, {
    [Symbol.toStringTag]: {value: 'Attributes'},
    [Symbol.isConcatSpreadable]: {value: false},
  });

  return {Attributes, Toggle};
})();

import.meta['components.Attributes'] = components.Attributes = Attributes;

/**
 * @typedef {*} attribute.value
 * @typedef {''} attribute.empty
 * @typedef {undefined | null | symbol} attribute.undefined
 * @typedef {true | 1 | 'true' | 'on' | 'yes'} attribute.true
 * @typedef {false | 0 | 'false' | 'off' | 'no'} attribute.false
 */

/**
 * @template T
 //@ts-ignore
 * @typedef {T extends attribute.true ? true : T extends attribute.false ? false : T extends attribute.empty ? '' : undefined} attribute.toggle
 */
