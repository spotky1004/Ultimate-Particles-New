import ComponentBase from "./ComponentBase.js";
import ElementBuilder from "../ElementBuilder.js";
import updateProperty from "../../../util/updateProperty.js";

/**
 * @typedef ExtraOptions
 * @property {string} defaultValue
 */
/**
 * @typedef {Omit<import("./ComponentBase.js").ComponentBaseOptions, "defaultValue"> & ExtraOptions} Options
 */

const templateElement = new ElementBuilder(/** @type {const} */ ({
  type: "div",
  cacheAs: "wrapper",
  classNames: "component__template",
  childs: [
    {
      type: "span",
      cacheAs: "name",
      classNames: "component__template__name",
    },
    {
      type: "span",
      cacheAs: "value",
      classNames: "component__template__value"
    }
  ]
}));

/**
 * @extends {ComponentBase<Options["defaultValue"], Options>}
 */
class ComponentTemplate extends ComponentBase {
  /**
   * @param {Options} options 
   */
  constructor(options) {
    super(options);
    const { element, cache } = templateElement.clone();
    /** @type {typeof element} */
    this.element = element;
    /** @type {typeof cache} */
    this.cache = cache;
    this.init();
  }

  set value(value) {
    this._value = value;
    this.render();
  }

  /**
   * @returns {Options["defaultValue"]}
   */
  get value() {
    return this.value;
  }

  render() {
    updateProperty(this.cache.name, "innerText", this.name);
    updateProperty(this.cache.value, "innerText", this.value);
  }

  clone() {
    return new ComponentTemplate(this.rawOptions);
  }
}

export default ComponentTemplate;
