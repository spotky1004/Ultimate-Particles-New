import StringExpression from "../../class/StringExpression.js";

/**
 * @param {string} input 
 * @returns {boolean}
 */
function isStringExpression(input) {
  return Boolean(StringExpression.parseExpression(input));
}

/**
 * @typedef InputData
 * @property {string} name
 * @property {string} description
 * @property {"string" | "exprssion"} type
 */

class Input {
  /**
   * @param {InputData} data
   */
  constructor(data) {
    /** @type {data["name"]} */
    this.name = data.name ?? "null";
    /** @type {data["description"]} */
    this.description = data.description ?? "";
    /** @type {data["type"]} */
    this.type = data.type || "string";

    const mainElement = document.createElement("div");
    mainElement.classList.add("editor__input-component");
    const nameElement = document.createElement("div");
    nameElement.innerText = this.name;
    nameElement.classList.add("editor__input-component__name");
    mainElement.appendChild(nameElement);
    /** @type {HTMLInputElement} */
    const inputElement = document.createElement("input");
    inputElement.placeholder = (this.type === "string" ? "Cannot" : "Can") + " use expression";
    inputElement.classList.add("editor__input-component__input");
    inputElement.classList.add("can-use-expression");
    inputElement.addEventListener("change", function() {
      const isExpression = this.classList.contains("can-use-expression") && isStringExpression(this.value);
      this.classList[isExpression ? "add" : "remove"]("is-expression");
    });
    mainElement.appendChild(inputElement);

    /** @type {typeof mainElement} */
    this.element = mainElement;
    /** @type {typeof inputElement} */
    this.input = inputElement;
  }

  reset() {
    this.input.value = "";
    this.input.classList.remove("is-expression");
  }

  export() {
    return this.input.value;
  }
}

export default Input
