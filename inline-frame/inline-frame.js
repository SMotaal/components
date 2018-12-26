import {html} from '../lib/helpers.js';

export class InlineFrameElement extends HTMLElement {
  constructor() {
    super();
    const root = this; // this.attachShadow({mode: 'closed'});
    let iframe;
    Object.defineProperty(this, 'iframe', {
      get: () => iframe || (this.iframe = document.createElement('iframe')),
      set: value => {
        if (value && !(value instanceof HTMLIFrameElement))
          throw TypeError(`inline-frame['iframe'] must be an iframe element`);
        if (value === iframe || (!value && !iframe)) return;
        if (iframe) (iframe.src = ''), iframe.remove();
        if (!(iframe = value || undefined)) return;
        const src = this.src;
        iframe.setAttribute('style', 'border: none; flex: 1; box-sizing: content-box;');
        src ? (iframe.src = src) : this.src = iframe.src;
        this.style.display = 'flex';
        root.appendChild(iframe);
      },
    });
  }

  get src() {
    return this.getAttribute('src') || '';
  }

  set src(value) {
    if (`${value || ''}` !== this.src) {
      this.setAttribute('src', value);
    }
    if (this.iframe && this.iframe.src !== value) {
      this.iframe.src = value;
    }
  }

  attributeChangedCallback(attributeName, previousValue, nextValue) {
    previousValue === nextValue || (this[attributeName] = nextValue);
    if (previousValue === nextValue) debugger;
  }
}

InlineFrameElement.observedAttributes = ['src'];

typeof customElements === 'object' && customElements && customElements.define('inline-frame', InlineFrameElement);

// connectedCallback() {
//   const {iframe = (this.iframe = document.createElement('iframe')), src = ''} = this;
//   iframe.style.border = 'none';
//   this.appendChild(iframe);
//   iframe.src === src || (iframe.src = src);
// }
// disconnectedCallback() {
//   if (this.iframe) {
//     const iframe = this.iframe;
//     iframe.remove();
//     // iframe.src = '';
//   }
// }
