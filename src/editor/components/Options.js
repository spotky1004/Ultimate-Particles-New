import ComponentBase from "./ComponentBase.js";

/**
 * @typedef Option
 * @property {string} name
 * @property {string} displayName
 * @property {import("./EditorComponent.js").default} component
 */

/**
 * @typedef OptionsData
 * @property {string} name
 * @property {string} description
 * @property {Option[]} options
 */

class Options extends ComponentBase {
  /**
   * @param {OptionsData} data
   */
  constructor({ data }) {
    super(arguments[0]);

    /** @type {typeof data["name"]} */
    this.name = data.name ?? "";
    /** @type {typeof data["options"]} */
    this.options = data.options;

    /** @type {number} */
    this.selectedIdx = -1;
  }

  reset() {

  }

  export() {
    if (this.selectedIdx !== -1) {
      const component = this.options[this.selectedIdx].component;
      return component.export();
    } else {
      return {};
    }
  }
}

export default Options;
