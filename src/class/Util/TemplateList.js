import objectEquals from "../../util/objectEquals.js";

/**
 * @template [T=string[]]
 */
class TemplateList {
  /**
   * @param {HTMLTemplateElement} templateElement 
   * @param {T} valueNames
   * @param {HTMLElement?} listElement
   */
  constructor(templateElement, valueNames, listElement) {
    /** @type {HTMLElement} */
    this.listElement = listElement ?? document.createElement("div");
    /** @type {HTMLTemplateElement} */
    this.template = templateElement;
    /** @type {T} */
    this.valueNames = valueNames;
    /** @type {Record<T[number], string>[]} */
    this._values = [];
  }

  get element() {
    return this.listElement;
  }

  /**
   * @param {Record<T[number], string>[]} values
   */
  set values(values) {
    /** @type {number[]} */
    let idxToChange = [];
    for (let i = 0; i < values.length; i++) {
      if (objectEquals(values[i], this._values[i])) continue;
      idxToChange.push(i);
    }
    this._values = [...values].map(value => ({...value}));
    this.render(idxToChange);
  }

  /**
   * @param {number[]} idxToChange
   */
  render(idxToChange) {
    const list = this.listElement;
    for (let i = 0; i < idxToChange.length; i++) {
      const idx = idxToChange[i];
      const toInsert = this.#renderOne(this._values[idx]);
      if (list.children.length >= idx) {
        list.appendChild(toInsert);
      } else {
        list.removeChild(list.children[idx]);
        list.appendChild(toInsert);
      }
    }
  }

  /**
   * @param {Record<T[number], string>} values 
   */
  #renderOne(values={}) {
    const element = document.importNode(this.template.content, true);
    for (const name in values) {
      const regex = new RegExp(`{{${name}}}`, "g");
      const value = values[name];
      element.textContent = element.textContent.replace(regex, value);
    }
    return element;
  }
}

export default TemplateList;
