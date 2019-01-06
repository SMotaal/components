#!/usr/bin/env node

const carlo = require('carlo');
const {existsSync} = require('fs');
// const {URL} = require('url');

const resolutions = {};
const resolve = path =>
  (resolutions[`resolve "${path}"`] = new URL(path, `file://${__filename}`).pathname);
const resolveMain = id => {
  try {
    return (resolutions[`resolveMain "${id}"`] = require.resolve(id));
  } catch (exception) {}
};

let resolved;

const base = __filename.replace(/[^\\/]+?$/, '');
const root = base.slice(0, -1);

const entry =
  (process.argv
    .slice(2)
    .find(
      arg =>
        (/^[a-z]\w+/i.test(arg) && (resolved = resolveMain(`./${arg}`))) ||
        (/.*?\.html$/.test(arg) && existsSync((resolved = resolve(`./${arg}`)))) ||
        (/^[a-z][a-z0-9]+(-[a-z0-9]+)+$/i.test(arg) &&
          existsSync((resolved = resolve(`./${arg}/${arg}.html`)))) ||
        (resolved = false),
    ) &&
    resolved.replace(root, '')) ||
  `index.html`;

console.log({root, entry, resolved, resolutions});

const title = '@smotaal/components';
// const icon = resolve('../resources/icon.png');
// const icon = resolve('../app_icon.png');
const bgcolor = '#99999999';
const channel = 'chromium';
// const executablePath = chromium.path;
const args = [
  /// Experimental Features
  '--enable-experimental-performance-features',
  '--enable-experimental-canvas-features',
  '--enable-experimental-web-platform-features',
  '--enable-experimental-input-view-features',
  // '--enable-experimental-extension-apis',

  /// Blink
  '--enable-viewport',
  // '--enable-features=SharedArrayBuffer,V8VmFuture',
  /// JavaScript / V8
  '--javascript-harmony',
  // '--js-flags="--allow-natives-syntax"',
  // '--enable-module-scripts-dynamic-import',
  /// Rendering
  '--force-color-profile=scrgb-linear',
  '--enable-harfbuzz-rendertext',
  // // '--enable-zero-copy',
  // // '--enable-lcd-text',
  /// UX/UI
  // '--disable-hosted-apps-in-windows',
  // '--disable-hosted-app-shim-creation',
  // '--disable-appcontainer',
  // '--auto-open-devtools-for-tabs',
  /// Random
  '--allow-running-insecure-content',
  '--unsafely-treat-insecure-origin-as-secure=domain',
  '--reduce-security-for-testing',
  '--expose-internals-for-testing',
  // '--native-crx-bindings',
  //
  // '--no-startup-window',
  // '--app '
  // '--force-app-mode',
  // '--create-app-windows-in-app',
  // '--create-browser-on-startup-for-tests'
];

(async () => {
  let app, relaunching, exiting;

  const launch = async () => {
    relaunching = false;
    if (app) return;
    app = await carlo.launch({
      args,
      channel,
      bgcolor,
      // executablePath,
      // icon,
      title,
    });
    app.on('exit', terminate);
    app.serveFolder(root);
    app.exposeFunction('relaunch', relaunch);
    await app.load(entry);
  };

  const terminate = async () => {
    if (!app) return;
    if (!exiting) {
      exiting = true;
    } else {
      await app.exit();
    }
    app = null;
    exiting = false;
    console.log({relaunching});
    if (relaunching) {
      await launch();
    } else {
      process.exit();
    }
  };

  const relaunch = async () => {
    relaunching = true;
    if (app) await app.exit();
    else await launch();
  };

  launch();

  // // app.on('exit', () => process.exit()); // exit on window close
  // // app.serveHandler(request => {
  // //   if (request.url().endsWith('/index.html')) request.fulfill({body: Buffer.from('<html>Hello World</hmtl>')});
  // //   else request.continue(); // <-- user needs to resolve each request, otherwise it'll time out.
  // // });
  // app.serveFolder(root);

  // // console.log(app.browserForTest());

  // // await app.exposeFunction('env', _ => process.env);
  // await app.load(entry);
})();

// const pathname = new URL(import.meta.url).pathname;
// const [dirname, filename] = pathname.split(/([^\/]*$)/);
// console.log('pathname: %O\n\tdirname: %O\n\tfilename: %O', pathname, dirname, filename);

// SEE: https://github.com/GoogleChromeLabs/carlo/blob/master/API.md
// SEE: https://peter.sh/experiments/chromium-command-line-switches/
// SEE: https://www.chromium.org/blink/runtime-enabled-features
// SEE: https://cs.chromium.org/chromium/src/third_party/blink/renderer/platform/runtime_enabled_features.json5
