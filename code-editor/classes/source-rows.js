/// <reference path = "./types.d.ts" />
// @ts-check

import {Indents, TABSIZE} from './indents.js';

const indents = new Indents();

/** @param {string} line */
const indentFromLine = line => indents.indentFromLine(line);
const zeroIndent = indentFromLine('');

let pre;

export const SPAN = 'code';
export const BLOCK = 'pre';

/**
 * @typedef {{noindents: boolean, nobreak: boolean, tabSize: number}} text
 * @typedef {{span: string, block: string}} tags
 * @typedef {{start: number, end: number}} range
 * @typedef {{code: string, indentation: number, inset: string, attributes: string}} row
 * @typedef {text & {lines: source['lines'], rows: string[]}} rows
 * @typedef {text & {style: string, span: string}} spans
 * @typedef {text & {attributes: string, block: string}} block
 * @typedef {rows & range & tags} render.rows
 * @typedef {block & spans & row} render.spans
 * @typedef {spans & row} render.block
 */
export class SourceRows extends Array {
  /**
   * @typedef {import('./source').Source} source
   * @param {source} source
   */
  constructor(source) {
    const length = (source && source.lines && source.lines.length) || undefined;
    length >= 0 ? super(length) : super();
    this.source = source;
  }

  get tabSize() {
    return (this.source && this.source.tabSize) || TABSIZE;
  }

  get lines() {
    return this.source && this.source.lines;
  }

  /**
   * @param {Options<render.rows>} options
   */
  renderRows({lines = this.lines, rows = this, tabSize, start, end, ...rest} = this) {
    let remain =
      (end >= 0 ? end : (end = (lines && lines.length) || 0)) - (start >= 0 ? start : (start = 0));

    // console.log(this, {lines, rows, tabSize, start, end, remain});

    if (!(remain > 0)) return rows || [];

    pre || (pre = document.createElement('pre'));
    tabSize > 0 || (tabSize = this.tabSize) > 0 || (tabSize = TABSIZE);
    rows || (rows = new Array((remain > 0 && remain) || 0));

    const {indents = (lines.indents = new Array(lines.length))} = lines;

    let indent;

    for (let row = 0, index = start; remain--; row++, index++) {
      const line = lines[index];
      line && (indent = indents[index] || (indents[index] = indentFromLine(line)));
      const {
        depth: {[tabSize]: indentation},
        inset,
        length: insetLength,
      } = indent || zeroIndent;
      const code = ((pre.textContent = (line && line.slice(insetLength)) || ''), pre.innerHTML);
      const attributes = `${row === 0 ? `line-number="${index + 10}"` : ''} ${
        indentation > 0 ? `indent="${indentation}"` : ''
      }`;

      const style = `--indent: ${indentation};`;
      rows[row] = this.renderBlock({code, inset, indentation, attributes, style, ...rest});
      // rows[row] = this.renderSpans({code, inset, indentation, attributes, style, ... rest});
      // rows[row] = `<div>${this.renderSpans({code, inset, indentation, attributes, style, ... rest})}</div>`;
    }

    // console.log({lines, rows});

    return rows;
  }

  /** @param {Options<render.spans>} options */
  renderSpans({code, indentation, inset, attributes, style, nobreak, span = SPAN}) {
    return `${
      indentation >= 0
        ? `<${span} class="indent">\t</${span}>`.repeat(indentation)
        : `<${span} class="indent">${inset || ''}</${span}>`
    }<${span}${(attributes && ` ${attributes}`) || ''}${(style && ` style="${style}"`) ||
      ''}>${code || ''}</${span}>${nobreak ? '' : '<br/>'}`;
  }

  /** @param {Options<render.block>} options*/
  renderBlock({attributes, block = BLOCK, ...spans}) {
    return `<${block}${(attributes && ` ${attributes}`) || ''}>${this.renderSpans(
      spans,
    )}</${block}>`;
  }
}
