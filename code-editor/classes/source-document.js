// @ts-check

import {Source} from './source.js';

/** @implements {Source} */
export class SourceDocument {
  /** @param {Options<{source: Source}>} options */
  constructor({source, ...properties}) {
    /** @type {Source} */
    this.source = new Source({...source, document: this});
    properties && Object.assign(this, properties);
  }

  /** @type {string} */
  set text(text) {
    this.source = new Source({text, document: this});
  }

  get text() {
    return this.source && this.source.text;
  }

  /** @type {string} */
  set lines(lines) {
    this.source = new Source({lines, document: this});
    // this.source = {text: (lines = [...lines]).join('\n'), lines};
  }

  get lines() {
    return this.source && this.source.lines;
  }
}
