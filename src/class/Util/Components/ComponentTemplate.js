import ComponentBase from "./ComponentBase.js";

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

const componentFrag = new DocumentFragment();
(() => {
  const wrapperElement = document.createElement("div");
  wrapperElement.classList.add("component__template");
  componentFrag.appendChild(wrapperElement);

  const nameElement = document.createElement("span");
  nameElement.classList.add("component__template__name");
  wrapperElement.appendChild(nameElement);

  const valueElement = document.createElement("span");
  valueElement.classList.add("component__template__value");
  wrapperElement.appendChild(valueElement);
})();

/**
 * @extends {ComponentBase<Options["defaultValue"]>}
 */
class ComponentTemplate extends ComponentBase {
  /**
   * @param {Options} options 
   */
  constructor(options) {
    super(options);
    /** @type {HTMLDivElement} */
    this.element = componentFrag.cloneNode(true).childNodes[0];
    /** @type {Elements} */
    this.elements = null;
    this.initElements();
    this.init();
  }

  initElements() {
    this.elements = {};
    this.elements.wrapper = this.element;
    this.elements.name = this.element.getElementsByClassName("component__template__name")[0];
    this.elements.value = this.element.getElementsByClassName("component__template__value")[0];
  }

  render() {
    this.elements.name.innerText = this.name;
    this.elements.value.innerText = this.value;
  }
}

export default ComponentTemplate;
