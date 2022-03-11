import Components from "../Util/Components/Forms/Components.js";

/**
 * @template [T=Object.<string, import("../Util/Components/Forms/index.js").AnyForm}]
 */
class ActionSchema {
  /**
   * @param {string} name 
   * @param {T} forms
   */ 
  constructor(name, forms) {
    /** @type {string} */
    this.name = name ?? "";
    /** @type {Components<{ forms: T }>} */
    this._components = new Components({ forms });
  }

  /**
   * Create new cloned components
   */
  get components() {
    return this._components.clone();
  }

  clone() {
    return new ActionSchema(this.name, this.components.forms);
  }
}

export default ActionSchema;
