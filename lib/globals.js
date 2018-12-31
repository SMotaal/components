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

export default globals;
