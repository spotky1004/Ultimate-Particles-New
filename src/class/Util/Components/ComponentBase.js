/**
 * @typedef ComponentBaseOptions
 * @property {string} name
 * @property {*} defaultValue
 */

/**
 * @template T
 * @template U
 */
class ComponentBase {
  /**
   * @param {object} options 
   * @param {string} options.name
   * @param {T} options.defaultValue
   */
  constructor(options={}) {
    /** @type {U} */
    this.rawOptions = options;
    
    /** @type {HTMLElement!} */
    this.element = null;
    /** @type {{}!} */
    this.cache = null;
    /** @type {string} */
    this.name = options.name;
    /** @type {T} */
    this.defaultValue = options.defaultValue ?? null;
    /** @type {T} */
    this._value = this.defaultValue;
  }

  init() {
    this.value = this.defaultValue;
  }

  /**
   * @param {T} value
   */
  set value(value) {
    this._value = value;
    this.render();
  }

  /**
   * @returns {Options["defaultValue"]}
   */
  get value() {
    return this._value;
  }

  render() {
    
  }

  /**
   * @returns {ComponentBase<T, U>}
   */
  clone() {
    return new ComponentBase(this.rawOptions);
  }
}

export default ComponentBase;
