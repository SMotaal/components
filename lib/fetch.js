/** @type {helpers.fetch} */
export const {loadTextFrom, loadSourceTextFrom} = ('TODO: await prettier fix',
/** @param {Partial<helpers.fetch>} helpers */
(helpers = {}, fallback) =>
  ({
    noop: fallback = (helpers.noop = () => {}),
    loadTextFrom: fallback = (helpers.loadTextFrom = (src, options) => {
      const url = `${new URL(src, location)}`;
      const request = fetch(url, options);
      const response = request.then(response => response).catch(helpers.noop);
      const text = request.then(response => response.text());
      text.url = url;
      text.request = request;
      text.response = response;
      return text;
    }),
    loadSourceTextFrom: fallback = (helpers.loadSourceTextFrom = async (src, options) => {
      try {
        return helpers.loadTextFrom(src, options);
      } catch (exception) {
        console.warn(exception);
        return '';
      }
    }),
  } = helpers))();

/** @typedef {(src: string | URL, options?: RequestInit) => Promise<string>} loadTextFrom */
/** @typedef {(src: string | URL, options?: RequestInit) => Promise<string>} loadSourceTextFrom */
/** @typedef {() => void} noop */
/** @typedef {{noop: noop, loadTextFrom: loadTextFrom, loadSourceTextFrom: loadSourceTextFrom}} helpers.fetch */
