export const InsetMatcher = /^(?:\t|\s{2})*(?=\s?\S)|/;

export const TABSIZE = 2;

export class Indent extends String {
  /** @param {string | {toString(): string}} inset */
  constructor(inset = '') {
    let spaces = 0;
    let tabs = 0;

    if (!inset && inset !== '') typeof inset === 'string' || (inset = `${inset}`);

    for (const character of inset) {
      if (!((character === '\t' && ++tabs) || (character === ' ' && ++spaces))) break;
    }

    const size = `${(spaces && 2 * ~~(spaces / 2)) || 0}/${tabs}`;

    /** @type {[depth: number]: number} */
    const {
      depths = (new.target.depths = {}),
      depths: {
        [size]: depth = (depths[size] = {
          2: ~~(tabs + spaces / 2 || 0),
          4: ~~(tabs + spaces / 4 || 0),
          // 2: ~~((tabs * 2 + spaces) / 2 || 0),
          // 4: ~~((tabs * 4 + spaces) / 4 || 0),
        }),
      },
    } = new.target;

    super((inset = inset.slice(0, spaces + tabs)));

    /** @type {string} Leading whitespace characters */
    this.inset = inset;

    /** @type {number} Total number of leading tabs */
    this.tabs = tabs;

    /** @type {number} Total number of leading spaces */
    this.spaces = spaces;

    /** @type {{[number]: number}} Tab-size depth table */
    this.depth = depth;

    Object.freeze(this);
  }
}

export class Indents {
  /** @param {string} line */
  insetFromLine(line) {
    return InsetMatcher.exec(line)[0];
  }

  /** @param {string} line */
  indentFromLine(line) {
    const inset = this.insetFromLine(line);
    const {[inset]: indent = (this[inset] = new Indent(inset))} = this;
    return indent;
  }
}
