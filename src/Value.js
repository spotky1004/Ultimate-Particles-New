import StringExpression from "./StringExpression.js";

class Value {
  /**
   * @param {*} value 
   */
  constructor(value) {
    /** @type {boolean} */
    this.isValueFixed = false;
    /** @type {number | string | StringExpression! | Value[] | Object.<string, Value>} */
    this.value = null;
    /** @type {"simple" | "array" | "object"} */
    this.type = null;

    if (typeof value === "number") {
      this.type = "simple";
      this.isValueFixed = true;
      this.value = value;
    } else if (typeof value === "string") {
      this.type = "simple";
      const expression = new StringExpression(value);
      if (!expression.isVaild) {
        this.isValueFixed = true;
        this.value = value;
      } else {
        this.isValueFixed = false;
        this.value = expression;
      }
    } else if (Array.isArray(value)) {
      this.type = "array";

      value = [...value];
      let isValuesAllFixed = true;
      for (let i = 0; i < value.length; i++) {
        value[i] = new Value(value[i]);
        if (!value[i].isValueFixed) isValuesAllFixed = false;
      }

      this.isValueFixed = isValuesAllFixed;
      this.value = value;
    } else if (typeof value === "object" && value !== null) {
      this.type = "object";

      value = {...value};
      let isValuesAllFixed = true;
      for (const key in value) {
        value[key] = new Value(value[key]);
        if (!value[key].isValueFixed) isValuesAllFixed = false;
      }

      this.isValueFixed = isValuesAllFixed;
      this.value = value;
    }
  }

  /**
   * @param {object} obj
   * @param {*} obj.value 
   * @param {string | number | undefined} obj.key 
   * @param {boolean} [isExpression]
   */
  changeValue({ key, value, isExpression}) {
    if (isExpression && typeof value === "string") {
      const expression = new StringExpression(value);
      if (expression.isVaild) value = expression;
    }

    if (key) {
      this.value[key] = value;
    } else {
      this.value = value;
    }
  }

  getValue(variables) {
    if (this.isValueFixed) {
      return this.expression;
    } else {
      if (this.type === "simple") {
        return this.value.eval(variables);
      } else if (this.type === "array") {
        let value = new Array(value.length).fill(null);
        for (let i = 0; i < this.value.length; i++) {
          value = this.value.getValue(variables);
        }
        return value;
      } else if (this.type === "object") {
        let value = {};
        for (const key in this.value) {
          value[key] = this.value[key].getValue(variables);
        }
        return value;
      }
    }
  }
}

export default Value;
