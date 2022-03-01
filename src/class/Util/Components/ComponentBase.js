/**
 * @typedef ComponentBaseOptions
 * @property {string} name
 * @property {*} defaultValue
 */

/**
 * @template {*} T
 */
class ComponentBase {
  /**
   * @param {object} options 
   * @param {string} options.name
   * @param {T} options.defaultValue
   */
  constructor(options={}) {
    /** @type {HTMLElement!} */
    this.element = null;
    /** @type {string} */
    this.name = options.name;
    /** @type {T} */
    this.defaultValue = options.defaultValue ?? null;
    /** @type {T} */
    this._value = this.defaultValue;
  }

  /**
   * @param {T} value
   */
  set value(value) {
    this._value = value;
    this.render();
  }

  /**
   * @returns {T}
   */
  get value() {
    return this.value;
  }

  resetValue() {
    this.value = this.defaultValue;
  }

  render() {
    
  }
}

export default ComponentBase;
