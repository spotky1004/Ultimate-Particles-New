const ElementEnum = {
  div: document.createElement("div"),
  span: document.createElement("span"),
  input: document.createElement("input"),
};

/**
 * @typedef {keyof ElementEnum} ElementTypes
 */
/**
 * @typedef ElementOptions
 * @property {string} saveAs
 * @property {string} [classNames]
 * @property {{ type: ElementTypes, options: ElementOptions }[]} [childs]
 */


/**
 * @template {ElementTypes} T
 * @template {ElementOptions} U
 */
class Element {
  /**
   * @param {T} type
   * @param {U} options
   */
  constructor(type, options={}) {
    /** @type {ElementEnum[T]} */
    this.element = document.createElement(type);
    /** @type {{ self: ElementEnum[T] } & Record<U["childs"][number]["options"]["saveAs"], ElementEnum[ElementTypes]>} */
    this.cache = {};
  }
}

export default Element;
