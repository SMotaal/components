import {window, document, process} from './globals.js';
import {resolve, preload} from './links.js';
import {resolvedPromise, awaitAll} from './async.js';

const root =
  (document && document.baseURI && new URL('./', document.baseURI)) ||
  (window && window.location && new URL('./', window.location)) ||
  (process && process.cwd && new URL(`file://${process.cwd()}`)) ||
  new URL('../', import.meta.url);

const BASE = '[[base]]';
const SCRIPTS = '[[scripts]]';
const STYLES = '[[styles]]';
const PRELOAD = '[[preload]]';
const types = {
  script: SCRIPTS,
  style: STYLES,
};

export class Asset extends URL {
  constructor(href, type, id) {
    let link, selector;
    if (id) {
      // console.log({href, type, id});
      if (type === 'style') {
        selector = `link#${CSS.escape(id)}`;
        link = document.querySelector(
          `${selector}[rel=stylesheet][href], ${selector}[rel=preload][as=style][href]`,
        );
      }
    }
    if (link && link.href) {
      super(link.href);
      Object.defineProperty(this, PRELOAD, {value: resolvedPromise});
    } else {
      super(href);
    }
    this.id = id;
    this.type = type;
    // Object.defineProperties(this, Object.getOwnPropertyDescriptors(Object.freeze({...this})));
  }

  get [PRELOAD]() {
    const value = preload(this, this.type);
    // const value =
    //   this.type === 'style' &&
    //   Array.prototype.find.call(document.styleSheets, ({href}) => (href = this.href))
    //     ? resolvedPromise
    //     : preload(this, this.type);
    Object.defineProperty(this, PRELOAD, {value});
    return value;
  }

  then(ƒ) {
    return this[PRELOAD].then(ƒ);
  }

  catch(ƒ) {
    return this[PRELOAD].catch(ƒ);
  }

  finally(ƒ) {
    return this[PRELOAD].finally(ƒ);
  }
}

export class Assets {
  /** @typedef {{base: string}} Options */
  /** @typedef {string} specifier */
  /** @param {Options} [options] */
  /** @param {... specifier} [specifiers] */
  constructor(options, ...specifiers) {
    const assets = {script: {}, style: {}};

    const {base = `${root}`} = {
      ...(((!arguments.length || typeof options === 'object') && options) ||
        (options = void ([...specifiers] = arguments))),
    };

    const descriptors = {
      [BASE]: {value: base},

      [SCRIPTS]: {
        get: () => {
          const promise = awaitAll(Object.values(assets.script));
          Object.defineProperty(this, SCRIPTS, {value: promise});
          return promise;
        },
        configurable: true,
      },

      [STYLES]: {
        get: () => {
          const promise = awaitAll(Object.values(assets.style));
          Object.defineProperty(this, STYLES, {value: promise});
          return promise;
        },
        configurable: true,
      },
    };

    for (const specifier of specifiers) {
      let [, type, href] = /^(?:(style|script|fetch):|)(.*)$/.exec(specifier);
      // const preloading = as && preload(specifier, as);

      if (!type || !(type in assets || (type = `${type}`.toLowerCase()) in assets)) {
        console.log({specifier, type, href});
        continue;
      }

      const url = resolve(href, base);
      url.startsWith(base) && (href = url.replace(base, ''));
      const id = `${type}:${href}`;

      Object.defineProperty(
        assets[type],
        href,
        (descriptors[id] = {value: new Asset(url, type, id), enumerable: true}),
      );

      id !== specifier && (descriptors[specifier] = {get: () => this[id]});
    }

    Object.defineProperties(this, descriptors);
  }

  resolve(specifier, referrer = this[BASE]) {
    return resolve(specifier, referrer);
  }

  static resolve(specifier, referrer = root) {
    return resolve(specifier, referrer);
  }
}
