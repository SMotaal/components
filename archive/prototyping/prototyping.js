/// <reference path="./types.d.ts" />
// @ts-check
import {ᵐᵉᵗᵃ as runtime} from './prototyping.js'; // root instance always bare

/** @type {prototyping.meta} */
export const ᵐᵉᵗᵃ = (import.meta['prototyping'] = Object.create(null));

/** Dynamic binding namespace */
let namespace = {};

bootstrap: {
  /** @type {prototyping.record.url<string>} */
  const url = import.meta['url']; // typescript be :)
  const [root, query = ''] = url.split('?', 2);
  const resolve = (specifier, referrer = root) => `${new URL(specifier, referrer)}`;
  const ValidID = /^[a-z]+$/;

  let id;

  if (query) {
    id = query.split('&', 1)[0];
    if (ValidID.test(id)) {
      namespace =
        runtime.local.namespace[id] ||
        (runtime.local.namespace[id] = Object.setPrototypeOf(
          Object.defineProperty(namespace, Symbol.toStringTag, {value: `Namespace ‹${id}›`}),
          null,
        ));
    }
  } else if (!query) {
    id = '﹡';
    // TODO: Uncomment if automatic namespace creation is needed
    dynamic: {
      // const namespaces = namespace;
      // const promises = {};
      // const validIDs = new Set();
      // const isValidID = id =>
      //   id &&
      //   id !== 'constructor' &&
      //   typeof id === 'string' &&
      //   (validIDs.has(id) || (ValidID.test(id) && validIDs.add(id) && true));
      // const importNamespace = async id =>
      //   promises[id] ||
      //   (isValidID(id)
      //     ? (namespaces[id] = (await import(`./prototyping.js?${id}`)).default)
      //     : undefined);
      // const createNamespace = id => {
      //   if (isValidID(id)) {
      //     const namespace = (namespaces[id] = Object.create(null, {
      //       [Symbol.toStringTag]: {value: `Namespace ‹${id}›`},
      //     }));
      //     promises[id] = importNamespace(id);
      //     return namespace;
      //   }
      // };
      // Object.setPrototypeOf(
      //   namespace,
      //   new Proxy(Object.freeze(Object.create(null)), {
      //     get(target, id) {
      //       if (isValidID(id)) return createNamespace(id);
      //     },
      //   }),
      // );
    }
  }

  if (id) {
    const {records = (runtime.records = {})} = (ᵐᵉᵗᵃ.runtime = runtime);
    const key = query || '﹡';
    records[key] = ᵐᵉᵗᵃ.local = Object.freeze({url, root, query, resolve, namespace, id});
  }
}

// initialize: {
//   const {resolve, query, root} = ᵐᵉᵗᵃ.local;
//   // TODO: Wire namespace bindings from query
//   namespace.a = 1;
//   namespace.b = namespace.a;
// }

export default namespace;
