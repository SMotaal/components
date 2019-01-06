/// <reference path="./types.d.ts" />
// @ts-check

export const globals = {};

const currentGlobal = (globals.global =
  typeof global === 'object' && global && global.global === global && global);

export {currentGlobal as global};
const currentSelf = (globals.self = typeof self === 'object' && self && self.self === self && self);

export {currentSelf as self};
const currentWindow = (globals.window =
  typeof window === 'object' && window.window === window && window);

export {currentWindow as window};
const currentDocument = (globals.document = typeof document === 'object' && document);

export {currentDocument as document};

/// Functions

/** @type {FunctionConstructor} */
// @ts-ignore
export const Function = function() {}.constructor;

export const {call: FunctionCall, bind: FunctionBind} = Function;
export const bind = FunctionBind.bind(FunctionCall);
export const call = FunctionCall.bind(FunctionCall);

/// Objects
/** @type {ObjectConstructor} */
// @ts-ignore
export const Object = {}.constructor;

export const {
  assign,
  defineProperty,
  defineProperties,
  create,
  freeze,
  seal,
  preventExtensions,
  getOwnPropertyDescriptor,
  getOwnPropertyDescriptors,
  getOwnPropertyNames,
  getOwnPropertySymbols,
  getPrototypeOf,
  setPrototypeOf,
  entries,
  keys,
  values,
  prototype: {isPrototypeOf: ObjectIsPrototypeOf, hasOwnProperty: ObjectHasOwnProperty},
} = Object;

/**
 * @type {<T>(prototype: T, object) => object is T}
 */
export const isPrototypeOf = FunctionCall.bind(Object.isPrototypeOf);

isPrototypeOf(Object.prototype, {});

/**
 * @type {<U extends string|symbol|number>(object: {}, property: U) => boolean}
 */
export const hasOwn = FunctionCall.bind(ObjectHasOwnProperty);

export default globals;
