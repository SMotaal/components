//* TEST: **
var hindex;
customElements.define(
  `h-${(hindex = 1 + (hindex || 0))}`,
  class extends HTMLHeadingElement {
    connectedCallback() {
      this.innerText = this.localName;
    }
  },
  {extends: 'h1'},
) || document.body.prepend(new (customElements.get(`h-${hindex}`))());

//* TEST: **
((e = document.createElement('h1')) => (
  e.attachShadow({mode: 'open'}).append('<shadow>', document.createElement('slot')),
  document.body.prepend((e.append(`<${e.localName}>`), e))
))();
