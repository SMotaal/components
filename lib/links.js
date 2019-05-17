import {document} from './globals.js';
import {resolvedPromise} from './async.js';

export const resolve = (specifier, referrer) => {
  try {
    return `${referrer === undefined ? new URL(specifier) : new URL(specifier, referrer)}`;
  } catch (exception) {}
};

export const preloading =
  (!document && {}) || document.links['[[preload]]'] || (document.links['[[preload]]'] = {});

export const preload = (src => {
  const preload = (href, as) => {
    let promise = preloading[href];
    if (!promise) {
      const {types, extensions, base} = preload;
      try {
        const url = new URL(href, preload.base);
        if (!as) {
          let [, extension] = /\.([^/.]+)$|/.exec(url.pathname.toLowerCase());
          if (!(extension in extensions))
            return Promise.reject(
              new TypeError(
                `Cannot preload "${url}"${
                  extension
                    ? ` - extension $"{extension}" is not supported`
                    : ' - cannot infer type'
                }.`,
              ),
            );
          as = preload.extensions[as];
        } else if (!types[(as = `${as}`.toLowerCase())]) {
          return Promise.reject(
            new TypeError(`Cannot preload "${url}" - type "${as}" is not supported.`),
          );
        }
        promise =
          preloading[url] ||
          (promise = preloading[href] = preloading[url] = createPreloadPromise({href, as}));
      } catch (exception) {
        return Promise.reject(exception);
      }
    }
    return promise;
  };

  const createPreloadPromise = ({
    href,
    url = href,
    as,
    document: ownerDocument = document,
    initiator = import.meta.url,
  }) => {
    if (!ownerDocument) {
      document ||
        preload.promise.warned ||
        (preload.promise.warned = !console.warn('[preload]: Preload is not supported.'));
      return resolvedPromise;
    }
    const {head = document.head} = ownerDocument;

    const type = types[as] || types[`${as}`.toLowerCase()] || as;

    const preloads = head.querySelectorAll(`link[rel=preload][as="${type}"]`);

    if (
      type === 'style' &&
      Array.prototype.find.call(ownerDocument.styleSheets, ({href}) => href === href)
    ) {
      return resolvedPromise;
    } else if (
      type === 'script' &&
      Array.prototype.find.call(ownerDocument.scripts, ({src}) => src === href)
    ) {
      return resolvedPromise;
    } else if (preloads && preloads.length) {
      url.pathname && (url.pathname = url.pathname.replace(/\/+/g, '/'));
      const href = `${url}`;
      for (const link of preloads) {
        if (link.href === href) return resolvedPromise;
        // console.log({href, url, 'link.href': link.href});
      }
    }

    let link = ownerDocument.createElement('link');
    const promise = Object.defineProperties(
      new Promise((resolve, reject) => {
        let done = event =>
          void (link.removeEventListener('abort', done),
          link.removeEventListener('error', done),
          link.removeEventListener('load', done),
          (done = resolve()),
          (promise.loaded = event.type === 'load') ||
            ((event.error && (promise.error = event.error)) || (promise[event.type] = true)));
        link.addEventListener('abort', done, {once: true});
        link.addEventListener('error', done, {once: true});
        link.addEventListener('load', done, {once: true});
      }).finally(() => {
        Object.defineProperty(promise, 'link', {value: (link = link.remove())});
      }),
      {link: {value: link, configurable: true}, initiator: {value: initiator}},
    );

    link.href = url;
    link.rel = 'preload';
    link.as = type;
    // as && (link.as = types[as] || types[`${as}`.toLowerCase()] || as);
    head.appendChild(link);
    return promise;
  };

  const base = (preload.base = `${(typeof location === 'object' &&
    typeof location.href === 'string' &&
    location) ||
    new URL(src.replace(/\/lib\/.*?$/i, ''))}`);
  const types = (preload.types = {});
  const extensions = (preload.extensions = {});

  types.fetch = 'fetch';
  extensions.js = types.script = types.module = 'script';
  extensions.css = types.stylesheet = types.style = 'style';
  extensions.html = types.document = 'document';

  return preload;
})(import.meta.url);
