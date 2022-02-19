import ComponentBase from "./ComponentBase.js";

/**
 * @typedef {Object.<string, any>} ComponentData
 */

class ComponentTemplate extends ComponentBase {
  constructor({ data }) {
    super(arguments[0]);

    this.data = data;
  }
}