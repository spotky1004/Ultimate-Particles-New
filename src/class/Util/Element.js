/**
 * @typedef ElementOptions
 * @property {keyof HTMLElementTagNameMap} type
 * @property {string} [cacheAs]
 * @property {string} [classNames]
 * @property {ElementOptions[]} [childs]
 */

/**
 * @template [T=ElementOptions]
 */
class Element {
  /**
   * @param {T} options
   */
  constructor(options) {
    /** @type {T} */
    this.options = options;
    const { parent: element, cache } = Element.createElement(undefined, options);
    /** @type {HTMLElementTagNameMap[T["type"]]} */
    this.element = element;
    /**
     * @typedef {import("../../util-types/DeepRemapObject").DeepRemapObject<T, "cacheAs", "type">} CacheTypes
     */
    /** @type {{ [K in keyof CacheTypes]-? : HTMLElementTagNameMap[CacheTypes[K]] }} */
    this.cache = cache;
  }

  /**
   * @param {HTMLElement} [parent] 
   * @param {ElementOptions} options 
   * @param {Object.<string, HTMLElement>} cache
   */
  static createElement(parent, options, cache={}) {
    if (typeof parent === "undefined") parent = document.createElement(options.type);
    if (typeof options.cacheAs !== "undefined") {
      cache[options.cacheAs] = parent;
    }
    if (typeof options.childs !== "undefined") {
      for (let i = 0; i < options.childs.length; i++) {
        const childOptions = options.childs[i];
        let child = document.createElement(childOptions.type);
        void Element.createElement(child, childOptions, cache);
        parent.appendChild(child);
      }
    }
    return { parent, cache };
  }

  clone() {
    return new Element(this.options);
  }
}

export default Element;
