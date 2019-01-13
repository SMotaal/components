// export {Source} from './classes/source.js';
// export {SourceDocument} from './classes/source-document.js';
// export {SourceView} from './classes/source-view.js';

// // export class SourceDocument {
// //   constructor({source, ...properties}) {
// //     this.source = new Source({...source, document: this});
// //     properties && Object.assign(this, properties);
// //   }

// //   /** @type {string} */
// //   set text(text) {
// //     this.source = new Source({text, document: this});
// //   }

// //   get text() {
// //     return this.source && this.source.text;
// //   }

// //   /** @type {string} */
// //   set lines(lines) {
// //     this.source = new Source({lines, document: this});
// //     // this.source = {text: (lines = [...lines]).join('\n'), lines};
// //   }

// //   get lines() {
// //     return this.source && this.source.lines;
// //   }
// // }

// // let pre;

// // const htmlFromLines = lines => {
// //   pre || (pre = document.createElement('pre'));
// //   const html = Array(lines.length);
// //   let index = 0;
// //   for (const line of lines) {
// //     html[index++] = ((pre.textContent = line || '\n'), `<pre>${pre.innerHTML}</pre>`);
// //   }
// //   return html;
// // };

// // const renderLineBlock = ({attributes, block = 'pre', ...spans}) =>
// //   `<${block}${(attributes && ` ${attributes}`) || ''}>${renderLineSpans(spans)}</${block}>`;

// // const renderLineSpans = ({
// //   code = '',
// //   indent,
// //   inset = '',
// //   attributes = '',
// //   style = '',
// //   nobreak = false,
// // }) =>
// //   `${
// //     indent >= 0 ? '<code class="indent">\t</code>'.repeat(indent) : `<code class="indent">${inset}</code>`
// //   }<code${(attributes && ` ${attributes}`) || ''}${(style && ` style="${style}"`) ||
// //     ''}>${code}</code>${nobreak || '<br/>' || ''}`;

// // const indentFromLine = line => {
// //   const [inset] = Inset.exec(line);
// //   const {[inset]: indent, depths} = indents;
// //   if (!indent) {
// //     const length = inset.length;
// //     let spaces = 0;
// //     let tabs = 0;
// //     for (const character of inset) character === '\t' ? tabs++ : spaces++;
// //     const size = `${(spaces && 2 * ~~(spaces / 2)) || 0}/${tabs}`;
// //     const {
// //       [size]: depth = (depths[size] = {
// //         2: ~~((tabs * 2 + spaces) / 2 || 0),
// //         4: ~~((tabs * 4 + spaces) / 4 || 0),
// //       }),
// //     } = depths;
// //     return (indents[inset] = {inset, length, tabs, spaces, depth});
// //   }
// //   return indent;
// // };
