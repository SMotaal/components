import {CustomElementTag,Component} from '../lib/helpers.js';

const options = {};

const REQUEST = `(fetch)`;
const RESPONSE = `(fetched)`;

class LayoutsView extends Component {

  initializeAttributes() {

  }

  initializeView() {

  }

}

(async () => {
  Layouts: {
    const {layouts = (options.layouts = [])} = options;
    const layoutTemplates = document.querySelectorAll(`template[layout]`);

    if (layoutTemplates) {
      for (const template of layoutTemplates) {
        let {
          textContent: source,
          attributes,
          attributes: {
            layout: {value: layout = ''},
            href: {value: href = ''},
          },
          [RESPONSE]: response,
        } = template;

        const tag = `${layout || ''}`.toLowerCase();

        if (!tag || !CustomElementTag.test(tag)) {
          console.warn(CustomElementTagError(tag));
          continue;
        }

        layouts[tag] = template;

        if (!source || !source.trim()) {
          try {
            href = `${href || `./${tag}.html`}`;
            template[RESPONSE] = undefined;
            response = await fetch((template[REQUEST] = fetch(href)));
            response.href = href;
            console.log('fetch(%O) => %O', `${href}`, response);
            // response.text = () => text;
            source = await response.text();
            template.setAttribute('href', href);
          } catch (exception) {
            console.warn(`Failed to load layout from %O`, href);
            source = '';
            src = url = undefined;
          }
          template.textContent = source;
          template[RESPONSE] = response;
        }
      }
    }
  }
})();

function CustomElementTagError(name) {
  return Reflect.construct(
    TypeError,
    [`tag "${name}" is not a valid custom element tag.`],
    CustomElementTagError,
  );
}
