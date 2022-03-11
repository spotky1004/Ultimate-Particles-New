import ComponentBase from "../ComponentBase.js";
import Components from "./Components.js";
import ElementBuilder from "../../ElementBuilder.js";
import updateProperty from "../../../../util/updateProperty.js";

/**
 * @typedef ExtraOptions
 * @property {Object.<string, Components>} components
 */
/**
 * @typedef {Omit<import("../ComponentBase.js").ComponentBaseOptions, "defaultValue"> & ExtraOptions} Options
 */

const elementBuilder = new ElementBuilder(/** @type {const} */ ({
  type: "div",
  cacheAs: "wrapper",
  classNames: "component__typed-components",
  childs: [
    {
      type: "div",
      classNames: "component__typed-components__type-select-wrapper",
      childs: [
        {
          type: "span",
          cacheAs: "name",
          classNames: "component__typed-components__name"
        },
        {
          type: "select",
          cacheAs: "select",
          classNames: "component__typed-components__select"
        }
      ]
    },
    {
      type: "div",
      cacheAs: "components",
      classNames: "component__typed-components__components"
    }
  ]
}));

/**
 * @template [T=Options]
 * @extends {ComponentBase<DefaultValue, T>}
 */
class TypedComponents extends ComponentBase {
  /**
   * @param {T} options 
   * @typedef {keyof T["components"]} Types
   * @typedef {{ [K in Types]-? : T["components"][K]["value"] }} DefaultValue
   */
  constructor(options) {
    options = {...options};
    /** @type {DefaultValue} */
    options.defaultValue = {};
    /** @type {{ [K in Types]-? : Components<T["components"][K]> }} */
    const components = {...options.components};
    for (const key in options.components) {
      options.defaultValue[key] = {...components[key].defaultValue};
    }
    super(options);

    /** @type {string[]} */
    this.types = Object.keys(options.components);
    /** @type {number} */
    this.selectedIndex = 0;
    /** @type {typeof components} */
    this.components = components;
    const { element, cache } = elementBuilder.clone();
    /** @type {typeof element} */
    this.element = element;
    /** @type {typeof cache} */
    this.cache = cache;
    this.init();

    this.components[this.getType()].init();
    for (let i = 0; i < this.types.length; i++) {
      const optionElement = document.createElement("option");
      optionElement.value = i;
      optionElement.text = this.types[i]
      this.cache.select.add(optionElement);
    }
    this.cache.select.addEventListener("change", (e) => {
      const prevType = this.types[this.cache.select.selectedIndex];
      if (typeof prevType !== "undefined") {
        const prevDisplayComponent = this.components[prevType];
        for (const key in prevDisplayComponent.forms) {
          prevDisplayComponent.forms[key].init();
        }
      }
      this.selectedIndex = this.cache.select.selectedIndex;
      this.render();
    });
  }

  getType() {
    return this.types[this.selectedIndex];
  }

  set value(value) {
    const type = this.getType();
    if (typeof type !== "undefined") {
      this.components[type].value = value;
      this.render();
    }
  }

  /**
   * @returns {DefaultValue[keyof DefaultValue]}
   */
  get value() {
    const type = this.getType();
    if (typeof type !== "undefined") {
      return this.components[type].value;
    } else {
      return undefined;
    }
  }

  render() {
    updateProperty(this.cache.name, "innerText", this.name);
    updateProperty(this.cache.select, "selectedIndex", this.selectedIndex);
    const type = this.getType();
    const componentsToDisplay = this.components[type];
    if (typeof componentsToDisplay !== "undefined") {
      const displayingComponents = this.cache.components.firstChild;
      if (
        displayingComponents !== null &&
        displayingComponents !== componentsToDisplay.element
      ) {
        this.cache.components.removeChild(displayingComponents);
      }
      componentsToDisplay.render();
      this.cache.components.appendChild(componentsToDisplay.element);
    }
  }

  /**
   * @returns {Input}
   */
  clone() {
    return new TypedComponents(this.rawOptions);
  }
}

export default TypedComponents;
