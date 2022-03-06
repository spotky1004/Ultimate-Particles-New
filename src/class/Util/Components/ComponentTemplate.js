import ComponentBase from "./ComponentBase.js";
import Element from "../Element.js";

/**
 * @typedef ExtraOptions
 * @property {string} defaultValue
 */
/**
 * @typedef {Omit<import("./ComponentBase.js").ComponentBaseOptions, "defaultValue"> & ExtraOptions} Options
 */
/**
 * @typedef Elements
 * @property {HTMLDivElement} wrapper
 * @property {HTMLSpanElement} name
 * @property {HTMLSpanElement} value
 */

const templateElement = new Element(/** @type {const} */ ({
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
 * @extends {ComponentBase<Options["defaultValue"]>}
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

  render() {
    this.cache.name.innerText = this.name;
    this.cache.value.innerText = this.value;
  }
}

export default ComponentTemplate;
