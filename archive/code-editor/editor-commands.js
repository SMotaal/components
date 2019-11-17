import { globals } from '../lib/globals.js';

export class EditorCommands {
  static createTextNode(text, document = this.document) {
    return document.createTextNode(text);
  }

  static getSelection(document = this.document) {
    return document.defaultView.getSelection();
  }

  static insertTextAtCursor(text, document = this.document) {
    let inserted;
    const selection = this.getSelection(document);
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode((inserted = this.createTextNode(text, document)));
    }
    return inserted;
  }

  // static async selectionFromEvents(target, ... events) {
  //   let range;

  //   for await (const event of events) {

  //   }
  // }
}

Object.defineProperties(EditorCommands, Object.getOwnPropertyDescriptors(globals));
