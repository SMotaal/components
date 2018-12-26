# Builtin Elements

A lot of hard but somewhat eager efforts have been made to make it possible to extend the behaviour of builtin elements by extending from their constructor (like `class extends HTMLButtonElement`) and adding the `extends` option (like `{ extends: 'button' }`). And while this seems to remain in the specs and while at least one browser has implemented it, and while developers (myself included) keep pushing for it, it does not necessarily mean that it is a good way forward.

## Specs

In order to extend `<button>` we need to define it:

```js
class ExtendedButton extends HTMLButtonElement {}

customElements.define('extended-button', ExtendedButton, {extends: 'button'});
```

Then we can do any of the following:

  - Use the class constructor:
    ```js
    new ExtendedButton();
    ```
  - Create the element:
    ```js
    document.createElement('button', {is: 'extended-button'});
    ```
  - Declare the element:
    ```html
    <button is="extended-button"></button>
    ```

> **Note**: This may not be up to date.

## Reality

**Semantics**

If we want to extend the behaviour of a builtin element `is="something-else"` cannot reasonably be the same thing as `is="anything-else"`. And while this implied to an extent achieved by forcing custom builtin elements to specify exactly which `something` it differs from, it does not mean that you cannot end up with some really bad outcomes in a fully compliant renderer.

When the renderer is not fully compliant, you need graceful fallback. If our `something-else` is different enough for you to need having it, you must ensure that our fallback will deliver it.

In both cases, you will need to consider if there are any performance gains, because clearly there are a lot more complexities involved here and the `is="something-else"` syntax does not feel too hot compared to `<other-button>` or even `<other-button role="button">`.

**Behaviours**

If all we want is to tap into the behaviours of the builtins, we will do so by sifting their events and modifying their properties.

If our button belongs to a group of buttons with certain behaviours, then those behaviours a more likely of a contextual nature.

In reality, builtin elements were designed for standardized behaviours, and in recent years, we've seen them come a long way. Still, we often need to use polyfills to mitigate non-confomances. The bottom line is that it is messy, and the thought of extending builtins using a polyfill which are already polyfilled is really out there. Fixing the bahviour of non-confoming elements by extending them, at least for the next few years, is untenable if ever possible.

## Solutions

**Contexts**

A different take on the problem of a `something-else` builtin is that a builtin within a context is something else:

```html
<segmented-buttons>
  <shadow>
    <style>…</style>
    <slot>…</slot>
  </shadow>
  <button>…</button>
</segmented-buttons>
```
