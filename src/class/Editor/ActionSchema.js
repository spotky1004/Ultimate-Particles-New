import Components from "../Util/Components/Forms/Components.js";

/**
 * @template [T=Object.<string, import("../Util/Components/Forms/index.js").AnyForm}]
 * @template [U=(value: Components<{ forms: T }>)<V> => V]
 */
class ActionSchema {
  /**
   * @param {string} name 
   * @param {U} finalize
   * @param {T} forms
   */ 
  constructor(name, finalize, forms) {
    /** @type {string} */
    this.name = name ?? "";
    /** @type {U} */
    this.finalize = finalize;
    /** @type {Components<{ forms: T }>} */
    this._components = new Components({ forms });
  }

  /**
   * @type {ReturnType<U>}
   */
  get value() {
    return this.finalize(this._components);
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
