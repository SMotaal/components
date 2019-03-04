//@ts-check
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import * as helpers from './helpers.js';

declare global {
  interface DocumentOrShadowRoot {
    activeElement: HTMLElement;
  }

  interface EventListenerOptions {
    passive: boolean;
    once: boolean;
  }
}
