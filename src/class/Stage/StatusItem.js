import Value from "../Util/Value.js";

const StatusItemTypeEnum = {
  Text: 0,
  Progress: 1,
  TextProgress: 2,
};
const StatusItemClassnames = {
  Text: "text",
  Progress: "progress",
  TextProgress: "text-progress",
};

/**
 * @typedef {keyof typeof StatusItemTypeEnum} StatusItemType
 */
/**
 * @typedef StatusItemData
 * @property {{ content: string, color: string }} Text
 * @property {{ bgColor: string, barStartCol: string, barEndCol: string, value: number, max: number }} Progress
 * @property {{ bgColor: string, barStartCol: string, barEndCol: string, value: number, max: number }} TextProgress
 */

/**
 * @template {StatusItemType} T
 */
class StatusItem {
  /**
   * @param {T} type 
   * @param {string} name 
   * @param {StatusItemData[T]} data 
   */
  constructor(name, type, data={}) {
    /** @type {T} */
    this.type = type;
    this.name = name;
    this._data = new Value(data);

    /** @type {HTMLElement} */
    const ele = document.createElement("div");
    ele.classList.add("status__item");
    ele.classList.add(StatusItemClassnames[this.type]);
    ele.setAttribute("name", this.name);
    this.ele = ele;
  }

  update(variables) {
    let value = this._data.getValue(variables);
    const ele = this.ele;
    ele.style = "";
    const style = ele.style;
    
    if (this.type === "Text") {
      style.setProperty("--txtCol", value.color ?? "");
    } else if (this.type === "Progress" || this.type === "TextProgress") {
      style.setProperty("--bgColor", value.bgColor ?? "");
      style.setProperty("--barStartCol", value.barStartCol ?? "");
      style.setProperty("--barEndCol", value.barEndCol ?? "");
      style.setProperty("--progress", Math.max(0, Math.min(1, value.value/value.max))*100+"%");
      value.content = `${value.value ? Math.floor(value.value) : 0}/${value.max ? Math.floor(value.max) : 0}`;
    }
    ele.setAttribute("content", value.content ?? "");
  }
}

export default StatusItem;
