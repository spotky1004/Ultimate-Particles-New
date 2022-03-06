class ActionSchema {
  /**
   * @typedef {import("../Util/Components/Forms/index.js").AnyForm} AnyForm
   */

  /**
   * @param {string} name 
   */ 
  constructor(name) {
    /** @type {string} */
    this.name = name ?? "";
    /** @type {AnyForm["rawOptions"][]} */
    this.formOptions = [];
  }

  /**
   * @param {AnyForm} form 
   */
  addForm(form) {
    this.formOptions.push(form.rawOptions);
    return this;
  }
}

export default ActionSchema;
