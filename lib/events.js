/// <reference path="./types.d.ts" />

/**
 * @template {EventTarget} T
 * @template {string} U
 * @template {EventListenerOptions} V
 * @extends {Function}
 */
export class EventListener {
  remove() {
    /** @type {{target: T, type: U, options: V}} */
    const {type, target, options} = this;
    return target.removeEventListener(type, this, options);
  }
}

EventListener.Options = (() => {
  /**
   * @extends {ReadonlyArray<string>}
   */
  class Presets extends Array {
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

  return Presets.define('EventListener.Options', {
    None: {},
    Active: {capture: false, once: false, passive: true},
    Capture: {capture: true, once: false, passive: false},
    Passive: {capture: false, once: false, passive: true},
    CapturePassive: {capture: true, once: false, passive: true},
    Once: {capture: false, once: true, passive: false},
    CaptureOnce: {capture: true, once: true, passive: false},
    OncePassive: {capture: false, once: true, passive: true},
    CaptureOncePassive: {capture: true, once: true, passive: true},
  });
})();

EventListener.Unknown = EventListener.Options.None;
EventListener.Active = EventListener.Options.Active;
EventListener.Capture = EventListener.Options.Capture;
EventListener.Passive = EventListener.Options.Passive;
EventListener.CapturePassive = EventListener.Options.CapturePassive;
EventListener.Once = EventListener.Options.Once;
EventListener.CaptureOnce = EventListener.Options.CaptureOnce;
EventListener.OncePassive = EventListener.Options.OncePassive;
EventListener.CaptureOncePassive = EventListener.Options.CaptureOncePassive;

/** @type {<T extends EventTarget, U extends string, V extends EventListenerOptions = {}>(target: T, type: U, handler: Function, options?: V) => EventListener<T, U, V>} */
EventListener.create = (target, ...args) => {
  let attached, options;
  try {
    const handler = args[1]; // .bind(target);
    (handler.target = target).addEventListener(
      (handler.type = args[0]),
      handler,
      (options = args[2]) || EventListener.Unknown,
    );
    return (attached = handler);
  } finally {
    if (attached) {
      attached.options =
        (options && EventListener.Options.matching(options)) || EventListener.Options.None;
      Object.setPrototypeOf(attached, EventListener.prototype);
    }
    // attached && (
    //   attached.remove = () =>
    // )
  }
};
