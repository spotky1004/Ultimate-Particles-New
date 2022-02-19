// @ts-check

/**
 * @typedef ComponentBaseParams
 * @property {string} name
 * @property {string} description
 */

class ComponentBase {
  /**
   * @param {ComponentBaseParams} param0 
   */
  constructor({ name="", description="" }) {
    /** @type {typeof name} */
    this.name = name;
    /** @type {typeof description} */
    this.description = description;
    /** @type {Object.<string, any>} */
    this.data = {};
  }

  reset() {

  }

  export() {
    return {};
  }
}

export default ComponentBase;
