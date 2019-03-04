import {Toggle} from './attributes.js';

export const data = {
  empty: {values: [''], expected: ''},
  undefined: {values: [undefined, null], expected: undefined},
  true: {values: [true, 1, 'true', 'yes', 'on'], expected: true},
  false: {values: [false, 1, 'false', 'no', 'off'], expected: false},
};

/**
 * @type {<T, U extends string>(aspect: T, description: U) => T & {description: U, toString: U}}
 */
const describe = (() => {
  const {assign} = Object;
  const prototype = {
    toString() {
      return this.description;
    },
  };
  return (aspect, description) =>
    Object.assign(((aspect.description = description), aspect), prototype);
})();

/** @type {(value: any) => string}  */
const stringify = (value, type) => (
  (type = typeof value),
  `‹${type} ${
    type === 'symbol' ? Symbol.keyFor(value) || 'Symbol(‹private›)' : JSON.stringify(value)
  }›`
);

export const suites = describe([], 'Toggle');

for (const {values, expected} of Object.values(data)) {
  const expectedString = stringify(expected);
  const suite = describe([], `Toggle => ${expectedString}`);
  for (const value of values) {
    const test = Toggle => Toggle(value) === expected;
    const description = `${test}`
      .replace('Toggle', '()')
      .replace('value', stringify(value))
      .replace('expected', expectedString);
    describe(test, description);
    suite.push((suite[description] = test));
  }
  suite.length && suites.push((suites[suite] = suite));
}

const {log, warn, group, groupEnd} = console;

(() => {
  group(`${suites}`, Toggle);
  try {
    for (const suite of suites) {
      group(`${suite}`);
      try {
        for (const test of suite) {
          group(`${test}`);
          try {
            log(test(Toggle));
          } catch (exception) {
            warn(exception);
          }
          groupEnd();
        }
      } finally {
        groupEnd();
      }
    }
  } finally {
    groupEnd();
  }
})();
