export {html} from '../../lib/templates.js';

/// Defaults
export const noop = () => {};

export const unresolved = Object.setPrototypeOf(
  new Promise(noop),
  Object.setPrototypeOf({then: noop, catch: noop, finally: noop}, Promise.prototype),
);

export const resolved = Promise.resolve();

/** @type {unknown} */
const unknown = '';

/// Properties

export const defineConstant = (object, property, value, enumerable = true, ownValue) => (
  property &&
    (typeof property === 'string' || typeof property === 'symbol') &&
    ({[property]: ownValue} = object) &&
    (value !== undefined || (value = ownValue) !== undefined) &&
    Object.defineProperty(object, property, {value, enumerable}),
  value
);

/// Requests
/** @param {string|URL} src */
export function loadTextFrom(src, options) {
  const url = `${new URL(src, location)}`;
  const request = fetch(url, options);
  const response = request.then(response => response).catch(noop);
  const text = request.then(response => response.text());
  text.url = url;
  text.request = request;
  text.response = response;
  return text;
}

/** @param {string|URL} src */
export async function loadSourceTextFrom(src) {
  try {
    // return (await fetch(src)).text();
    return loadTextFrom(src);
  } catch (exception) {
    console.warn(exception);
    // return ''; // `${exception}`;
  }
}

const importedContent = {};

export const childrenFrom = fragment => {
  if (fragment && typeof fragment === 'object') {
    if ('querySelectorAll' in fragment && 'children' in fragment) {
      const children = [...fragment.children];
      const items = fragment.querySelectorAll(':scope > [id]');
      if (items) {
        for (const item of items) {
          children[item.id] = item;
        }
      }
      return children;
    } else if (Array.isArray(fragment)) {
      return fragment;
    }
  }
  return [];
};

/** @param {string|URL} src */
export async function importContent(src) {
  const url = `${new URL(src, location)}`;
  let fragment, children, sourceText;
  const {
    [url]: imported = (importedContent[url] = loadTextFrom(url).then(text => {
      if (text == null) {
        return (importedContent[url] = undefined);
      } else {
        sourceText = text;
        fragment = fragmentFrom(sourceText);
        children = childrenFrom(fragment);
        return {url, sourceText, fragment, children};
      }
    })),
  } = importedContent;

  await imported;

  (children || fragment || sourceText) &&
    console.log('importContent(%O) => %O', `${src}`, {
      imported,
      children,
      fragment,
      sourceText,
    });

  return imported;
}

export async function importContentFrom(src, container = document.body) {
  const {sourceText, fragment, children} = await importContent(src);
  if (fragment.childElementCount) {
    console.log('importContentFrom(%O, %O) => %O', `${src}`, container, {
      sourceText,
      fragment,
      children,
      // fragmentChildren: childrenFrom(fragment),
    });
    for (const child of children) {
      container.appendChild(child);
    }
    // container.appendChild(fragment);
    // container.append(... fragment.children);
  }
}

/// Templates
const defaultTemplate = document.createElement('template');

export function fragmentFrom(html) {
  const fragment = document.createDocumentFragment();
  defaultTemplate.innerHTML = html;
  fragment.appendChild(defaultTemplate.content);
  return fragment;
}

/**
 * @param {string} sourceText
 * @param {HTMLElement|DocumentFragment} [container]
 * @param {boolean} [append]
 */
export function renderSourceText(sourceText, container, append = false) {
  container && !append && (container.innerHTML = '');

  // defaultTemplate.innerHTML =
  //   (sourceText && sourceText.replace(/^.*/gm, line => `<pre>${line, '<br/>'}</pre>`)) || '\n';

  defaultTemplate.innerHTML = '';
  const fragment = defaultTemplate.content;

  for (const line of sourceText.split('\n')) {
    const element = document.createElement('pre');
    element.textContent = line || '\n';
    fragment.appendChild(element);
  }

  (container || (container = document.createDocumentFragment())).appendChild(
    defaultTemplate.content,
  );
  return container;
}

/**
 * @param {string} sourceText
 * @param {DocumentFragment|HTMLElement} [container]
 * @param {boolean} [append]
 */
export async function renderSourceTextFrom(src, container, append = false) {
  return renderSourceText(await loadSourceTextFrom(src), container, append);
}

/// Tags & IDs

const idFromElement = Element =>
  (Element && (Element.id || (Element.name && idFromName(Element.name)))) || '';

const tagFromElement = Element =>
  (Element &&
    (Element.tag ||
      (Element.id && tagFromID(Element.id)) ||
      (Element.name && tagFromName(Element.name)))) ||
  '';

const idFromName = name =>
  (name &&
    typeof name === 'string' &&
    `${name}`
      .replace(/[a-z](?=[A-Z\d])|\d(?=[A-Za-z])|[A-Z][A-Z\d]+(?=[a-z])/g, '$&-')
      .toLowerCase()) ||
  '';

const tagFromName = name => (name && typeof name === 'string' && tagFromID(idFromName(name))) || '';

const tagFromID = id =>
  (id && typeof id === 'string' && id.replace(/(-.+?)-element$/, '$1').toLowerCase()) || '';

const idFromTag = tag =>
  (tag && typeof tag === 'string' && tag.replace(/(?:-element|)$/, '-elementt').toLowerCase()) ||
  '';

/// ShadowRoot Options

const shadowFrom = shadow => {
  const argument = shadow;
  if (shadow) {
    let {mode = typeof shadow === 'string' ? shadow : null, delegatesFocus = null} = shadow;
    delegatesFocus === null ||
      typeof delegatesFocus === 'boolean' ||
      (delegatesFocus =
        delegatesFocus == true || delegatesFocus == false || !isNaN(delegatesFocus)
          ? delegatesFocus === '' || !!delegatesFocus
          : /^true$|^yes|^on$/i.test(delegatesFocus) || !/^false$|^no|^off$/i.test(delegatesFocus));
    (shadow =
      (mode &&
        (((mode = /^open|^closed/i.exec(mode)) && (mode = mode[0].toLowerCase())) ||
          (typeof delegatesFocus !== null && (mode = 'open'))) && {mode}) ||
      null) &&
      (delegatesFocus !== null || (shadow.delegatesFocus = delegatesFocus));
  }
  return shadow || null;
};

/// Elements

const definedElements = {};

export function defineElement(
  Element,
  {
    id = Element.id || idFromElement(Element),
    tag = Element.tag || (id && tagFromID(id)),
    template = Element.template || (id && document.querySelector(`template#${id}`)) || null,
    shadow = Element.shadow || null,
  } = Element,
) {
  const defined = customElements.get(tag);
  if (!defined) {
    defineConstant(Element, 'id', id);
    defineConstant(Element, 'tag', tag);
    defineConstant(Element, 'template', template);
    shadow ||
      ((template.hasAttribute('shadow') || template.hasAttribute('delegates-focus')) &&
        (shadow = {
          mode: template.getAttribute('shadow') || 'open',
          delegatesFocus: template.getAttribute('delegates-focus'),
        }));
    defineConstant(Element, 'shadow', shadowFrom(shadow));
    customElements.define(tag, Element);
    return Promise.resolve((definedElements[id] = Element));
  } else if (!arguments[1]) {
    return Promise.resolve(defined);
  }
  // Unconventionally throw instead of reject!
  throw Error(
    `Cannot change properties for ${(Element && Element.name) ||
      typeof Element} since it was already defined`,
  );
}

// const importedElements = {};

// export async function importElementFrom(url) {
//   const source = await loadSourceTextFrom(url);
//   defaultTemplate.innerHTML = source;
//   const fragment = defaultTemplate.content;
//   const template = fragment.querySelector('template[id$="-element"]');
//   const id = template && template.id;
//   const tag = tagFromID(id);
//   if (id) {
//     Object.defineProperty(definedElements, id, {
//       get: noop,
//       set: value =>
//         Object.defineProperty(defineElements, id, {
//           value,
//           enumerable: true,
//           writable: true,
//           configurable: true,
//         }),
//     });
//   }
//   document.head.append(fragment);
//   const Element = id && definedElements[id];
// }
// export function importElement(src) {
//   const url = `${new URL(src, location)}`;
//   let imported = importedElements[url];
//   if (!imported) {
//     imported = importedElements[url] = loadSourceTextFrom(url);
//   }
// }

////////////////////////////////////////////////////////////////////////////////
//
// (template.hasAttribute('shadow') &&
// (shadow = {
//   mode: template.getAttribute('shadow') || 'open',
//   delegatesFocus: !Boolean(
//     !template.hasAttribute('shadow') ||
//       /^false$|^no$/i.test(template.getAttribute('delegates-focus')),
//   ),
// }))
