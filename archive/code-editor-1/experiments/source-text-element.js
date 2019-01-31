import {renderSourceTextFrom, defineElement, html} from './helpers.js';

// console.log('imported!');

const template = document.head.append(html`
  <template id="source-text-element" shadow="open" delegates-focus>
    <style>
      /* :host(source-text),
    :host(.source-text-container) {
      display: contents;
    } */

      .source-text-wrapper {
        --gutter-width: 4rem;
        --code-inset: 0.5ch;
        --first-line: 1;
        /* position: relative; */
        /* background: #eee9; */
        overflow-y: hidden;
        /* overflow-clip-box: content-box; */
        /* contain: content; */
        will-change: transform;
        /* overflow-wrap: break-word; */

        /* width: inherit; */
        /* height: inherit; */
      }

      x.source-text-wrapper.linenumbers {
        /* border-inline-start: var(--gutter-width) #9999 solid; */
        /* box-sizing: border-box; */
        background-image: linear-gradient(
          90deg,
          #9999 var(--gutter-width),
          #eee9 var(--gutter-width),
          #eee9 100%
        );
        background-color: transparent;
        background-origin: content-box;
      }

      x.source-text-wrapper.linenumbers::before {
        display: block;
        position: fixed;

        top: 0;
        /* inset-inline-end: 0; */
        left: 0;
        right: 0;
        /* inset-block-end: 0; */
        /* margin-top: -100%; */

        /* width: 100%; */
        height: 100%;
        /* margin-block-end: -100%; */
        /* align-self: stretch; */
        /* justify-self: stretch; */
        /* margin-bottom: -100%; */
        /* background-color: #ddde; */
        /* border-inline-end: 1px solid #9999; */
        box-shadow: 0 0 5px #0003;
        border-inline-start: var(--gutter-width) #9999 solid;
        pointer-events: none;
        content: '';
      }

      slot.source-text {
        counter-reset: linenumber var(--first-line, 1);
      }

      .source-text::slotted(pre) {
        margin: 0;
        padding: 0 var(--code-inset);
        padding-inline-start: calc(2em + var(--code-inset));
        text-indent: -2em;
        white-space: pre-wrap;
        /* border-inline: 1px solid #9999; */
        /* position: relative; */
      }

      .linenumbers > .source-text::slotted(pre) {
        /* margin-inline-start: var(--gutter-width); */
        counter-increment: linenumber;
        padding-inline-start: calc(2em + var(--gutter-width) + var(--code-inset));
        /* padding-inline-start: 0; */
      }

      .linenumbers .source-text::slotted(pre)::before {
        text-indent: 0;
        display: inline-block;
        align-self: stretch;
        /* height: 100%; */
        position: sticky;
        inset-inline-start: 0;
        margin-inline-start: calc(-1 * var(--gutter-width));
        /* right: 100%; */
        /* left: right:; */
        /* inset-inline-start: calc(-1 * var(--code-offset)); */
        width: var(--gutter-width);
        text-align: right;
        content: counter(linenumber) ' ';
        pointer-events: none;
        z-index: 1;
        /* background-color: #ddde; */
        /* border-inline-end: 1px solid #9999; */
        /* box-shadow: 0 0 5px #0003; */
      }

      .source-text-wrapper.flex {
        display: flex;
        flex-flow: column nowrap;
      }

      ol > .source-text {
        list-style-position: outside;
        list-style-type: decimal;
      }

      ol > .source-text::slotted(pre) {
        display: list-item;
        list-style-position: outside;
        list-style-type: decimal;
      }
    </style>
    <div class="source-text-wrapper linenumbers"><slot class="source-text"></slot></div>
  </template>
`);

let defined;

export class SourceTextElement extends HTMLElement {
  constructor() {
    super();
    const {template, shadow} = new.target;
    const root = shadow ? this.attachShadow(shadow) : this;
    template && root.appendChild(template.content.cloneNode(true));
  }

  static get defined() {
    return defineElement(this);
  }
}
