//@ts-check
// / <reference lib="dom" />
// / <reference lib="dom.iterable" />
// / <reference lib="es2020" />

import {css} from '../css';
import {html, template} from '../templates';
import {Component} from '../component';
import {Attributes} from '../attributes';
import {Assets} from '../assets';

declare global {
  interface ImportMeta {
    url: string;
    ['components.css']?: typeof css;
    ['components.html']?: typeof html;
    ['components.template']?: typeof template;
    ['components.Assets']?: typeof Assets;
    ['components.Attributes']?: typeof Attributes;
    ['components.Component']?: typeof Component;
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
