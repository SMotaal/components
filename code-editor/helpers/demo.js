const noop = () => {};
const defaultTemplate = (() => {
  try {
    return document.createElement('template');
  } catch (exception) {
    return {};
  }
})();

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
    return '';
    // return ''; // `${exception}`;
  }
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
