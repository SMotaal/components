const defaults = {
  log: console.log,
  warn: console.warn,
  base: `${new URL('../', import.meta.url)}`,
  specifiers: ['style:styles/common/debug.css'],
};

export default async options => {
  let log, warn, returned, thrown, result;
  let assets, Assets, base, specifiers;
  const results = {};
  try {
    ({
      log,
      warn,
      Assets = (await import('./assets.js')).Assets,
      base = defaults.base,
      specifiers = defaults.specifiers,
    } = options || defaults);

    results[`new Assets({base: "${base}"}, … specifiers) => `] = assets = new Assets(
      {base},
      ...specifiers,
    );

    for await (const specifier of specifiers) {
      result = results[`await assets["${specifier}"] => `] = {specifier};
      try {
        result.resolved = await assets[specifier];
      } catch (reason) {
        result.rejected = reason;
      }
    }

    return (returned = results);
  } catch (error) {
    return (thrown = results.error = error);
  } finally {
    warn && thrown && warn('[%s]: %o', import.meta.url, results);
    log && returned && log('[%s]: %o', import.meta.url, results);
  }
};

typeof process === 'object' &&
  process.argv &&
  process.argv[1] &&
  import.meta.url === `${new URL(process.argv[1], 'file:///')}` &&
  import(import.meta.url)
    .then(module => module.default())
    .then(console.log)
    .catch(console.warn);
