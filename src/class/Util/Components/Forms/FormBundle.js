import ComponentBase from "../ComponentBase.js";
import ElementBuilder from "../../ElementBuilder.js";

/**
 * @typedef {import("./index.js").AnyForm} AnyForm
 */
/**
 * @typedef ExtraOptions
 * @property {Object.<string, AnyForm>} forms
 */
/**
 * @typedef {Omit<import("../ComponentBase.js").ComponentBaseOptions, "name" | "defaultValue"> & ExtraOptions} Options
 */

const elementBuilder = new ElementBuilder(/** @type {const} */ ({
  type: "div",
  cacheAs: "wrapper",
  classNames: "component__form-bundle"
}));

/**
 * @template [T=Options]
 * @extends {ComponentBase<DefaultValue, T>}
 */
class FormBundle extends ComponentBase {
  /**
   * @typedef {T["forms"]} Forms
   * @typedef {{ [K in keyof Forms]-? : Forms[K]["defaultValue"] }} DefaultValue 
   */
  /**
   * @param {T} options 
   */
  constructor(options) {
    /** @type {DefaultValue} */
    const defaultValue = {};
    for (const key in options.forms) {
      defaultValue[key] = options.forms[key].defaultValue;
    }
    options.defaultValue = defaultValue;
    super(options);
    const { element, cache } = elementBuilder.clone();
    /** @type {typeof element} */
    this.element = element;
    /** @type {typeof cache} */
    this.cache = cache;
    /** @type {Forms} */
    this.forms = this.rawOptions.forms;
    this.init();

    for (const key in this.forms) {
      this.element.appendChild(this.forms[key].element);
    }
  }

  set value(value) {
    this._value = value;
    this.render();
  }

  get value() {
    /** @type {DefaultValue} */
    const value = {};
    for (const key in this.forms) {
      value[key] = this.forms[key].value;
    }
    return value;
  }

  render() {
    for (const key in this.forms) {
      this.forms[key].render();
    }
  }

  clone() {
    /** @type {T} */
    const rawOptions = {...this.rawOptions};
    /** @type {Options["forms"]} */
    const forms = {...rawOptions.forms};
    for (const key in forms) {
      forms[key] = forms[key].clone();
    }
    rawOptions.forms = forms;
    return new FormBundle(rawOptions);
  }
}

import Input from "./Input.js";
import Select from "./Select.js";

const b = new FormBundle(/** @type {const} */ ({
  forms: {
    type: new Select({
      name: "Type: ",
      defaultValue: 2,
      options: [
        "number",
        "integer",
        "string",
        "boolean",
      ]
    }),
    value: new Input({
      name: "Value: ",
      hint: "Input value here"
    })
  }
}));
window.bb = b;
document.getElementById("editor").appendChild(b.element);
setInterval(() => {
  console.log(b.value);
}, 500);

export default FormBundle;
