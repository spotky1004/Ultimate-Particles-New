import Components from "../Util/Components/Forms/Components.js";

/**
 * @template [T=Object.<string, import("../Util/Components/Forms/index.js").AnyForm}]
 * @template [U=(value: Components<{ forms: T }>["forms"])<V> => V]
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
    this.components = new Components({ forms });
  }

  /**
   * @type {ReturnType<U>}
   */
  get value() {
    return this.finalize(this.components.forms);
  }

  clone() {
    return new ActionSchema(this.name, this.finalize, this.components.clone().forms);
  }
}

export default ActionSchema;
