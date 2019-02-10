/// <reference path="./types.d.ts" />
/// <reference types="node" />

// @ts-check

export const globals = {};

const currentGlobal = (globals.global =
  typeof global === 'object' && global && global.global === global && global);
export {currentGlobal as global};

const currentProcess = (globals.process =
  currentGlobal && typeof currentGlobal.process === 'object' && currentGlobal.process);
export {currentProcess as process};

const currentSelf = (globals.self = typeof self === 'object' && self && self.self === self && self);
export {currentSelf as self};

const currentWindow = (globals.window =
  typeof window === 'object' && window.window === window && window);
export {currentWindow as window};

const currentDocument = (globals.document = typeof document === 'object' && document);
export {currentDocument as document};

/** @type {FunctionConstructor} */
// @ts-ignore
globals.Function = function() {}.constructor;
/** @type {ObjectConstructor} */
// @ts-ignore
globals.Object = {}.constructor;

/// Functions

export const bind = globals.Function.bind.bind(globals.Function.call);
export const call = globals.Function.call.bind(globals.Function.call);

/// Objects
/** @type {ObjectConstructor} */
// @ts-ignore
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
  // prototype: {isPrototypeOf: ObjectIsPrototypeOf, hasOwnProperty: ObjectHasOwnProperty},
} = globals.Object.constructor;

/**
 * @type {<T>(prototype: T, object) => object is T}
 */
export const isPrototypeOf = globals.Function.call.bind(globals.Object.prototype.isPrototypeOf);

/**
 * @type {<U extends string|symbol|number>(object: {}, property: U) => boolean}
 */
export const hasOwn = globals.Function.call.bind(globals.Object.prototype.hasOwnProperty);

export default globals;
