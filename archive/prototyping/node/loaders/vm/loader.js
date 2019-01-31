const vm = require('vm');

const IdentifierName = /^[$_\p{ID_Start}][$_\p{ID_continue}]*$/;

const createModuleBindings = bindings => {
  const moduleBindings = {};
  for (const key in bindings) {
    const value = bindings[key];
    const binding = value && typeof value === 'function' && value.length === 0 && value;
    const identifierName = binding && typeof key === 'string' && IdentifierName.test(key) && key;
    identifierName &&
      (moduleBindings[identifierName] = {
        get: binding,
        enumerable: false,
        configurable: false,
      });
  }
  return moduleBindings;
};
const createModuleNamespaceObject = bindings =>
  Object.create(null, {
    ...(bindings && createModuleBindings(bindings)),
    [Symbol.toStringTag]: {
      value: 'Module',
      writable: false,
      enumerable: false,
      configurable: false,
    },
  });

console.log({vm});

const ExportABC = `export const [a, b, c] = [...'abc'];\n`;
const ExportScope = `export const scope = {global};\n`;
const ExportDefault = `export default 'default';\n`;
const ExportAll = `${ExportABC}${ExportScope}${ExportDefault}`;
const ExportStar = `export * from 'exporter';\n`;

{
  const script = new vm.Script(
    `
    import('./module.mjs').then(console.log).catch(console.warn)
  `,
    {
      importModuleDynamically: async (specifier, referrer, resolve) => {
        let moduleNamespace;
        if (vm.SourceTextModule) {
          const dependency = new vm.SourceTextModule(ExportAll, {url: 'vm:exporter'});
          const module = new vm.SourceTextModule(ExportStar, {url: 'vm:importer'});
          await module.link((...args) => {
            console.log(
              `module.link(${Array(args.length)
                .fill('%O')
                .join(', ')})`,
              ...args,
            );
            return dependency;
          });
          module.instantiate();
          await module.evaluate();
          return module;
        } else {
          const bindings = {
            default: () => 'default',
          };
          const moduleNamespace = createModuleNamespaceObject();
          console.log(
            `importModuleDynamically(%O, %O, %O) => `,
            specifier,
            referrer,
            resolve,
            moduleNamespace,
          );
        }
        return moduleNamespace;
      },
    },
  );

  script.runInThisContext();
}

module.exports = {
  resolve: (specifier, referrer, resolve) => resolve(specifier, referrer),
};
