/** @type {(src: string | URL, options?: RequestInit) => Promise<string>} */
export const loadTextFrom = (src, options) => {
  const url = `${new URL(src, location)}`;
  const request = fetch(url, options);
  const text = request
    .catch(error => {
      text.error = error;
    })
    .then(response => (text.response = response).text());
  text.url = url;
  text.request = request;
  return text;
};

/** @type {(src: string | URL, options?: RequestInit) => Promise<string>} */
export const loadSourceTextFrom = async (src, options) => {
  try {
    return loadTextFrom(src, options);
  } catch (exception) {
    // console.warn(exception);
    return '';
  }
};
