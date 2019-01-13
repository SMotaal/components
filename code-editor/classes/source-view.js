import {SourceDocument} from './source-document.js';
import {SourceRows} from './source-rows.js';

export class SourceView {
  /** @param {import('./element.js').CodeEditor} element */
  constructor(element) {
    this.element = element;
  }

  set source(source) {
    const text =
      (source &&
        ((source.text && 'string' === typeof source.text && source.text) ||
          ('string' === typeof source && source))) ||
      '';

    if (source !== this.source) {
      // this.updateDocument(new SourceDocument({text}));
      this.updateDocument(new SourceDocument(source !== text ? {source} : {source: {text}}));
    }
  }

  get source() {
    if (this.sourceDocument) return this.sourceDocument.source;
  }

  /** @param {SourceDocument} sourceDocument */
  updateDocument(sourceDocument) {
    const {element, sourceDocument: currentDocument} = this;

    if (sourceDocument !== currentDocument) {
      if (sourceDocument && !(sourceDocument instanceof SourceDocument)) {
        throw TypeError(
          `updateDocument expects the optional argument to be a valid SourceDocument instance`,
        );
      }

      // TODO: Release current document from view;
      if (element && element.releaseSource) element.releaseSource();

      this.sourceDocument = undefined;
      this.rows = (sourceDocument && new SourceRows(sourceDocument.source)) || undefined;
      // element.innerHTML = rows.renderRows({tabSize: element.tabsize}).join('\n');

      /** @type {SourceDocument} */
      this.sourceDocument = sourceDocument || undefined;

      if (element) {
        element.updateSource && element.updateSource();
        element.updateRows && element.updateRows();
      }
    }
  }
}

// const {lines, html} = sourceDocument;
// element.innerHTML = (
//   html || (sourceDocument.html = SourceView.renderLines({lines, tabSize: element.tabsize}))
// ).join('\n');
// this.rows = html;
