export const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

export const {defineProperty, defineProperties, assign, getOwnPropertyDescriptor, getOwnPropertyNames} = Object;

export const initializeProperty = (
  target,
  property,
  {value, get, set, writable = true, enumerable = true, configurable = true},
) => (
  !target ||
    !property ||
    hasOwnProperty(target, property) ||
    defineProperty(
      target,
      property,
      get || set ? {get, set, enumerable, configurable} : {value, writable, enumerable},
    ),
  target
);

/**
 * @template {{[name: K]: V}} T
 * @template {string|symbol} K
 * @template V
 * @param {T} target
 * @param {K} property
 * @param {V} value
 */
export const updateProperty = (target, property, value) => (
  !target ||
    !property ||
    ((!hasOwnProperty(target, property) ||
      (getOwnPropertyDescriptor(property) || '').configurable !== false) &&
      defineProperty(target, property, {
        get: () => value,
        set: value => updateProperty(target, property, value),
        configurable: true,
      })),
  target
);
