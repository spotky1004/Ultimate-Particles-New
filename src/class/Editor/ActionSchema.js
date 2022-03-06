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
    /** @type {{ [K in keyof T]-? : T[K]["rawOptions"] }} */
    this.formOptions = Object.fromEntries(Object.entries(forms).map(([key, form]) => [key, form?.rawOptions]));
  }
}

export default ActionSchema;
