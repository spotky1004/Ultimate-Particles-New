import ComponentBase from "../ComponentBase.js";
import ElementBuilder from "../../ElementBuilder.js";
import updateProperty from "../../../../util/updateProperty.js";

/**
 * @typedef ExtraOptions
 * @property {string[]} options
 * @property {number} defaultValue
 */
/**
 * @typedef {Omit<import("../ComponentBase.js").ComponentBaseOptions, "defaultValue"> & ExtraOptions} Options
 */

const templateElement = new ElementBuilder(/** @type {const} */ ({
  type: "div",
  cacheAs: "wrapper",
  classNames: "component__select",
  childs: [
    {
      type: "span",
      cacheAs: "name",
      classNames: "component__select__name",
    },
    {
      type: "select",
      cacheAs: "value",
      classNames: "component__select__value"
    },
  ]
}));

/**
 * @extends {ComponentBase<Options["defaultValue"]>}
 */
class Select extends ComponentBase {
  /**
   * @param {Options} options 
   */
  constructor(options) {
    super(options);
    const { element, cache } = templateElement.clone();
    /** @type {typeof options["options"]} */
    this._options = [];
    /** @type {typeof element} */
    this.element = element;
    /** @type {typeof cache} */
    this.cache = cache;

    this.options = options.options ?? [];
    this.init();

    this.cache.value.addEventListener("change", (e) => {
      this.value = this.cache.value.selectedIndex;
    });
  }

  get options() {
    return this._options;
  }

  /**
   * @param {Options["options"]} options
   */
  set options(options) {
    this._options = options;
    this.render();
  }

  render() {
    updateProperty(this.cache.name, "innerText", this.name);
    updateProperty(this.cache.value, "innerText", this.value)
    /** @type {HTMLOptionElement[]} */
    const optionElements = [...this.cache.value.childNodes].slice(1);
    for (let i = 0; i < Math.max(optionElements.length, this.options.length); i++) {
      const optionValue = i.toString();
      const optionText = this.options[i];

      let optionElement = optionElements[i];
      if (this.options.length >= optionElements.length) {
        if (typeof optionElement === "undefined") {
          optionElement = document.createElement("option");
          this.cache.value.insertBefore(optionElement, optionElements[i]);
        }
        updateProperty(optionElement, "value", optionValue);
        updateProperty(optionElement, "text", optionText);
      } else {
        this.cache.value.removeChild(optionElement);
        i--;
      }
    }
    this.cache.value.selectedIndex = this.value;
  }
}

let t = new Select({
  name: "Option Component / ",
  options: [
    "Option 0",
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
    "Option x", "Option x", "Option x", "Option x", "Option x",
    "Option x", "Option x", "Option x", "Option x", "Option x",
    "Option x", "Option x", "Option x", "Option x", "Option x",
    "Option x", "Option x", "Option x", "Option x", "Option x",
    "Option x", "Option x", "Option x", "Option x", "Option x",
    "Option x", "Option x", "Option x", "Option x", "Option x",
    "Option x", "Option x", "Option x", "Option x", "Option x",
    "Option x", "Option x", "Option x", "Option x", "Option x",
  ]
});
document.getElementById("editor").appendChild(t.element);
setInterval(() => {
  t.options = [...t.options].slice(0, -1);
}, 500);

export default Select;
