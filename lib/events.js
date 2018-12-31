/// <reference path="./types.d.ts" />

import {Presets} from './constructs.js';

/// EventListener

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

EventListener.Options = Presets.define('EventListener.Options', {
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
