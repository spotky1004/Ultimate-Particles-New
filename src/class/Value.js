import StringExpression from "./StringExpression.js";

/**
 * @template T
 */
class Value {
  /**
   * @param {T} value 
   * @param {Objsct.<string, string | number>} variables
   */
  constructor(value, variables) {
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
        if (
          expression.expression.length === 1 &&
          expression.expression[0][0][0] === "$"
        ) {
          this.isValueFixed = true;
          this.value = expression.eval(variables);
        } else {
          this.isValueFixed = false;
          this.value = expression;
        }
      }
    } else if (Array.isArray(value)) {
      this.type = "array";

      value = [...value];
      let isValuesAllFixed = true;
      for (let i = 0; i < value.length; i++) {
        value[i] = new Value(value[i], variables);
        if (!value[i].isValueFixed) isValuesAllFixed = false;
      }

      this.isValueFixed = isValuesAllFixed;
      this.value = value;
    } else if (typeof value === "object" && value !== null) {
      this.type = "object";

      value = {...value};
      let isValuesAllFixed = true;
      for (const key in value) {
        value[key] = new Value(value[key], variables);
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
      this.value[key].value = value;
    } else {
      this.value = value;
    }
  }

  /**
   * @returns {T} 
   */
  getValue(variables) {
    if (this.isValueFixed && this.type === "simple") {
      return this.value;
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
        return Object.fromEntries(
          Object.entries(this.value).map(
            ([key, value]) => [key, value.getValue(variables)]
          )
        );
      }
    }
  }
}

export default Value;
