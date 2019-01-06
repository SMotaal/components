/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

declare global {
  interface DocumentOrShadowRoot {
    activeElement: HTMLElement;
  }

  interface EventListenerOptions {
    passive: boolean;
    once: boolean;
  }
}


type Extends<U, T> = U extends T ? true : false;
