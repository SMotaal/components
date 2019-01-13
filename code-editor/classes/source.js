/// <reference path = "./types.d.ts" />
// @ts-check

import {TABSIZE} from './indents.js';

/**
 * @extends {Array<string>}
 */
export class Lines extends Array {
  /** @param {Iterable<string>} source */
  constructor(source) {
    const text = typeof source === 'string' && source;
    const lines =
      ((source || source === '') &&
        source[Symbol.iterator] &&
        (typeof source === 'string' ? source.split('\n') : source)) ||
      undefined;

    lines ? super(...lines) : super();

    this.text = text || this.join('\n');
    this.source = source;
  }
}

/**
 * @typedef {import('./indents').Indent} Indent
 * @type {Indent[]?}
 */
Lines.prototype.indents = undefined;

export class Source {
  /** @param {Options<{text: string, lines: string[]}>} options */
  constructor({text, lines, ...properties}) {
    /** @type {Lines} */
    this.lines = lines = new Lines(text != null ? text : lines || '');
    /** @type {string} */
    this.text = this.lines.text;

    properties && Object.assign(this, properties);
  }
}

Source.prototype.tabSize = TABSIZE;
