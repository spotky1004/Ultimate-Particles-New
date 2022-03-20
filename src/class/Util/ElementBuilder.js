/**
 * @typedef ElementBuilderOptions
 * @property {keyof HTMLElementTagNameMap} type
 * @property {string} [cacheAs]
 * @property {string} [classNames]
 * @property {ElementOptions[]} [childs]
 */

/**
 * @template [T=ElementBuilderOptions]
 */
class ElementBuilder {
  /**
   * @param {T} options
   */
  constructor(options) {
    /** @type {T} */
    this.options = options;
    const { parent: element, cache } = ElementBuilder.createElement(undefined, options);
    /** @type {HTMLElementTagNameMap[T["type"]]} */
    this.element = element;
    /**
     * @typedef {import("../../util-types/DeepRemapObject").DeepRemapObject<T, "cacheAs", "type">} CacheTypes
     * @typedef {{ [K in keyof CacheTypes]-? : HTMLElementTagNameMap[CacheTypes[K]] }} ElementCache
     */
    /** @type {ElementCache} */
    this.cache = cache;
  }

  /**
   * @param {HTMLElement} [parent] 
   * @param {ElementBuilderOptions} options 
   * @param {Object.<string, HTMLElement>} cache
   */
  static createElement(parent, options, cache={}) {
    if (typeof parent === "undefined") parent = document.createElement(options.type);
    if (typeof options.classNames !== "undefined") {
      parent.className = options.classNames;
    }
    if (typeof options.cacheAs !== "undefined") {
      cache[options.cacheAs] = parent;
    }
    if (typeof options.childs !== "undefined") {
      for (let i = 0; i < options.childs.length; i++) {
        const childOptions = options.childs[i];
        let child = document.createElement(childOptions.type);
        void ElementBuilder.createElement(child, childOptions, cache);
        parent.appendChild(child);
      }
    }
    return { parent, cache };
  }

  clone() {
    return new ElementBuilder(this.options);
  }
}

export default ElementBuilder;
