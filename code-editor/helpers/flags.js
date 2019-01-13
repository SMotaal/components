import {assign} from './properties.js';

/**
 * @typedef {string | {[name: string]: any}} parameter
 * @typedef {(parameter|parameter[])[]} parameters
 * @param {parameters} parameters
 * @returns {{[name: string]: any}}
 */
export const Flags = (...parameters) => {
  const flags = {};

  for (const parameter of parameters.flat()) {
    const type = typeof parameter;
    if (type === 'string') {
      const [, state = '', key] = /^(\++|\-+|)(.*?)$/.exec(parameter);
      if (state[0] === '-') {
        flags[key] = state.length > 1 ? (flags[key] + 1 || 0) - state.length : false;
      } else {
        flags[key] = state.length > 1 ? (flags[key] - 1 || 0) + state.length : true;
      }
    } else if (type === 'object') {
      assign(flags);
    }
  }

  return flags;
};
