import StatusItem from "./StatusItem.js";

class Status {
  constructor() {
    this.ele = document.getElementById("status");
    /** @type {StatusItem[]} */
    this.items = [];
  }

  update(varibles) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].update(varibles);
    }
  }

  /**
   * @param {string} name 
   * @param {import("./StatusItem.js").StatusItemType} type 
   * @param {import("./StatusItem.js").StatusItemData[import("./StatusItem.js").StatusItemType]} data 
   */
  addItem(name, type, data) {
    if (this.items.length > 25) return;
    const item = new StatusItem(name, type, data);
    this.items.push(item);
    this.ele.appendChild(item.ele);
  }

  /**
   * @param {string} name 
   */
  removeItem(name) {
    const toRemove = this.items.findIndex(item => item.name === name);
    if (toRemove !== -1) {
      const removed = this.items.splice(toRemove, 1)[0];
      this.ele.removeChild(removed.ele);
    }
  }
}

export default Status;
