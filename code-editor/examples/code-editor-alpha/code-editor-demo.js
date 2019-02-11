import './code-editor-element.js';
import {renderSourceTextFrom} from './helpers.js';

const codeEditor = document.querySelector('code-editor');

if (codeEditor) {
  renderSourceTextFrom(`${new URL('./code-editor-element.js', import.meta.url)}`, codeEditor);
  // renderSourceTextFrom('./element.js', codeEditor);
  // codeEditor.appendChild(renderSourceText(loadSourceTextFrom('./element.js')));
}
