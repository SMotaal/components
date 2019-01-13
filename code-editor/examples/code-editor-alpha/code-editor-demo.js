import './code-editor-element.js';
import {renderSourceTextFrom, loadSourceTextFrom, local} from './helpers.js';

const codeEditor = document.querySelector('code-editor');
if (codeEditor) {
  renderSourceTextFrom(local('./code-editor-element.js'), codeEditor);
  // renderSourceTextFrom('./element.js', codeEditor);
  // codeEditor.appendChild(renderSourceText(loadSourceTextFrom('./element.js')));
}
