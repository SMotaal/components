import { EditorCommands } from './editor-commands.js';

export class EditorCommandsLegacy extends EditorCommands {
  /** @returns {Selection} */
  static getSelection(document = this.document) {
    return document.selection;
  }

  static insertTextAtCursor(text, document = this.document) {
    let inserted;
    const selection = this.getSelection(document);
    if (selection.createRange) {
      selection.createRange().text = inserted = text;
    }
    return inserted;
  }
}
