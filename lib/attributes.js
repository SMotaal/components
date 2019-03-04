//@ts-check

/**
 * @template T
 * @param {T} value
 * @returns {attribute.toggle<T>}
 */
export const Toggle = (matcher => value =>
  ((value !== null && value !== undefined && typeof value !== 'symbol') || undefined) &&
  (value === true ||
    value == true ||
    ((value !== '' || '') &&
      ((value !== false && value != false) || false) &&
      (value = matcher.exec(value) || undefined) &&
      (value[1] ? true : value[2] ? false : undefined))))(/\b(?:(true|on|yes)|(false|off|no))\b/i);

/**
 * @typedef {*} attribute.value
 * @typedef {''} attribute.empty
 * @typedef {undefined | null | symbol} attribute.undefined
 * @typedef {true | 1 | 'true' | 'on' | 'yes'} attribute.true
 * @typedef {false | 0 | 'false' | 'off' | 'no'} attribute.false
 */

/**
 * @template T
 * @typedef {T extends attribute.true ? true : T extends attribute.false ? false : T extends attribute.empty ? '' : undefined} attribute.toggle
 */
