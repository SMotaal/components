/// <reference path = "./types.d.ts" />
// @ts-check

import {TABSIZE} from './indents.js';

const cache = {};

/**
 * @extends {Array<string>}
 */
export class Lines extends Array {
  /** @param {string|Iterable<string>} source */
  constructor(source) {
    const type = (source == null && `${source}`) || typeof source;
    const text = /** @type {string} */ (type === 'string' && source);
    const cached = source && cache[source];
    const lines =
      cached ||
      ((source || source === '') &&
        source[Symbol.iterator] &&
        (type === 'string' ? text.split('\n') : source)) ||
      undefined;

    lines ? super(...lines) : super();

    this.text = text || lines.text || (lines.text = this.join('\n'));

    cached || (cache[this.text] = lines);
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
