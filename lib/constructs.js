/// PRESETS
/**
 * @extends {ReadonlyArray<string>}
 */
export class Presets extends Array {
  matching(object) {
    if (Object.values(this).includes(object)) return object;
    const key = Presets.keyFor(object);
    if (key) return Presets[key];
  }
}

/**
 * @type {{<T extends {}>(type: string, presets: T): Readonly<T> & ReadonlyArray<keyof T & string>}}
 */
Presets.define = (definitions, type) => {
  const names = Object.getOwnPropertyNames(definitions);
  const presets = new Presets();
  for (const name of names) {
    const object = definitions[name];
    const preset = Presets.preset(object);
    if (!preset) continue;
    const key = Presets.key(preset);
    presets[key] = presets[name] = Object.freeze(
      Object.defineProperty(
        Object.defineProperties(
          Reflect.construct(String, [key], Object),
          Object.getOwnPropertyDescriptors(preset),
        ),
        {
          [Symbol.toStringTag]: {value: `${type}.${name}`},
        },
      ),
    );
    presets.push(name);
  }
  return Object.freeze(Object.defineProperty(presets, 'Symbol.toStringTag', {value: `${type}`}));
};

Presets.mappings = new WeakMap();

Presets.keyFor = preset => {
  if (!preset || typeof preset !== 'object' || [Symbol.iterator] in preset) return;

  let key = Presets.mappings.get(preset);

  if (key) return key;

  try {
    return Presets.key(Presets.preset(preset), null, 0);
  } catch (exception) {}
};

Presets.key = preset => JSON.stringify(preset, null, 0);

Presets.preset = object => {
  if (!object || typeof object !== 'object' || [Symbol.iterator] in object) return;
  const preset = {};
  for (const key of Object.getOwnPropertyNames(object).sort()) {
    object[key] === undefined || (preset[key] = object[key]);
  }
  return preset;
};
