//@ts-check
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2020" />

// import {css} from '../css';
// import {html, template} from '../templates';
// import {Component} from '../component';
// import {Attributes} from '../attributes';
// import {Assets} from '../assets';

declare global {
  interface ImportMeta {
    url: string;
    // ['components.css']?: import('./templates.js')['css'];
    // ['components.html']?: import('./templates.js')['html'];
    // ['components.template']?: import('./templates.js')['template'];
    // ['components.Assets']?: import('./assets.js')['Assets'];
    // ['components.Attributes']?: import('./attributes.js')['Attributes'];
    // ['components.Component']?: import('./component.js')['Component'];
  }

  interface Globals {}

  interface DocumentOrShadowRoot {
    activeElement: HTMLElement;
  }

  interface EventListenerOptions {
    passive: boolean;
    once: boolean;
  }

  interface Attributes {}
}
