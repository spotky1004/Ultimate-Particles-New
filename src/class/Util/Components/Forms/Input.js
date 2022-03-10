import ComponentBase from "../ComponentBase.js";
import ElementBuilder from "../../ElementBuilder.js";
import updateProperty from "../../../../util/updateProperty.js";

/**
 * @typedef ExtraOptions
 * @property {string} [hint]
 * @property {string} defaultValue
 */
/**
 * @typedef {Omit<import("../ComponentBase.js").ComponentBaseOptions, "defaultValue"> & ExtraOptions} Options
 */

const elementBuilder = new ElementBuilder(/** @type {const} */ ({
  type: "div",
  cacheAs: "wrapper",
  classNames: "component__input",
  childs: [
    {
      type: "span",
      cacheAs: "name",
      classNames: "component__input__name",
    },
    {
      type: "input",
      cacheAs: "value",
      classNames: "component__input__value"
    }
  ]
}));

/**
 * @extends {ComponentBase<Options["defaultValue"], Options>}
 */
class Input extends ComponentBase {
  /**
   * @param {Options} options 
   */
  constructor(options) {
    super(options);
    const { element, cache } = elementBuilder.clone();
    /** @type {typeof options["hint"]} */
    this.hint = options.hint;
    /** @type {typeof element} */
    this.element = element;
    /** @type {typeof cache} */
    this.cache = cache;
    this.init();

    this.cache.value.addEventListener("change", (e) => {
      this.value = this.cache.value.value;
    });
  }

  set value(value) {
    this._value = value;
    this.render();
  }

  /**
   * @returns {Options["defaultValue"]}
   */
  get value() {
    return String(this._value ?? "");
  }

  render() {
    updateProperty(this.cache.name, "innerText", this.name);
    updateProperty(this.cache.value, "placeholder", this.hint);
    updateProperty(this.cache.value, "value", this.value ?? "");
  }

  /**
   * @returns {Input}
   */
  clone() {
    return new Input(this.rawOptions);
  }
}

export default Input;
