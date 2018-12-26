class NameMap {
  constructor(properties) {
    properties && Object.assign(this, properties);
  }
  [Symbol.iterator]() {
    return Object.values(this)[Symbol.iterator]();
  }
}

/** @see … */
export const ClipboardEvents = new NameMap({
  BeforePaste: 'beforepaste',
  BeforeCut: 'beforecut',
});

/** @see https://www.w3.org/TR/uievents/#events-keyboard-types */
export const KeyboardEvents = new NameMap({
  KeyDown: 'keydown',
  KeyUp: 'keyup',
  // KeyPress: 'keypress',
});

/** @see https://www.w3.org/TR/uievents/#events-input-types */
export const InputEvents = new NameMap({
  BeforeInput: 'beforeinput',
  Input: 'input',
});

/** @see https://www.w3.org/TR/uievents/#events-composition-types */
export const CompositionEvents = new NameMap({
  CompositionStart: 'compositionstart',
  CompositionUpdate: 'compositionupdate',
  CompositionEnd: 'compositionend',
});

/** @see https://www.w3.org/TR/uievents/#events-uievent-types */
export const UIEvents = new NameMap({
  Load: 'load',
  Unload: 'unload',
  Abort: 'abort',
  Error: 'error',
  Select: 'select',
});

/** @see https://www.w3.org/TR/uievents/#events-focus-types */
export const FocusEvents = new NameMap({
  // Blur: 'blur',
  // Focus: 'focus',
  FocusIn: 'focusin',
  FocusOut: 'focusout',
});

export const EditorHostEvents = new NameMap({
  ...FocusEvents,
});

export const EditorEvents = new NameMap({
  ...ClipboardEvents,
  ...InputEvents,
  ...CompositionEvents,
  ...KeyboardEvents,
});
