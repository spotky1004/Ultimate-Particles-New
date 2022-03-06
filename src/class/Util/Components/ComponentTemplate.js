import ComponentBase from "./ComponentBase.js";
import ElementBuilder from "../ElementBuilder.js";

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

  render() {
    this.cache.name.innerText = this.name;
    this.cache.value.innerText = this.value;
  }
}

export default ComponentTemplate;
