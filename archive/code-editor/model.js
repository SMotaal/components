class CodeEditorModel {
  constructor(model) {
    model && this.restore(model);
  }

  restore(model) {
    Object.assign(this, model);
  }

  save() {
    const model = {...this};
    return model;
  }
}

Object.setPrototypeOf(CodeEditorModel.prototype, {
  tabsize: 2,
  autocorrect: false,
  linenumbers: true,
  readonly: false,
});

export {CodeEditorModel as Model};
