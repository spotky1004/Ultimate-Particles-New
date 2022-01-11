import StringExpression from "./StringExpression.js";

/**
 * @template T
 */
class Value {
  /**
   * @param {T} value 
   * @param {Object.<string, string | number>} constants
   */
  constructor(value, constants) {
    /** @type {boolean} */
    this.isValueFixed = false;
    /** @type {number | string | StringExpression! | Value[] | Object.<string, Value>} */
    this.value = null;
    /** @type {"simple" | "array" | "object"} */
    this.type = null;

    const valueType = typeof value;

    if (valueType === "number" || valueType === "boolean" || valueType === "undefined" || value === null) {
      this.type = "simple";
      this.isValueFixed = true;
      this.value = value;
    } else if (valueType === "string" || value instanceof StringExpression) {
      this.type = "simple";
      const expression = valueType === "string" ? new StringExpression(value) : value;
      if (!expression.isVaild) {
        this.isValueFixed = true;
        this.value = value;
      } else {
        if (
          constants &&
          expression.expression.length === 1 &&
          expression.expression[0][0][0] === "$" &&
          typeof constants[expression.expression[0][0].slice(1)] !== "undefined"
        ) {
          this.isValueFixed = true;
          this.value = expression.eval(constants);
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
        value[i] = new Value(value[i], constants);
        if (!value[i].isValueFixed) isValuesAllFixed = false;
      }

      this.isValueFixed = isValuesAllFixed;
      this.value = value;
    } else if (valueType === "object" && value !== null) {
      this.type = "object";

      value = {...value};
      let isValuesAllFixed = true;
      for (const key in value) {
        value[key] = new Value(value[key], constants);
        if (!value[key].isValueFixed) isValuesAllFixed = false;
      }

      this.isValueFixed = isValuesAllFixed;
      this.value = value;
    }
  } 

  /**
   * @param {object} obj
   * @param {*} obj.value 
   * @param {string | number | (string | number)[]} obj.key 
   * @param {Object.<string, number>} [obj.variables]
   */
  changeValue({ key, value, variables }) {
    if (this.type === "object" || this.type === "array") {
      const isKeyArray = Array.isArray(key)
      const keyToUse = isKeyArray ? key[0] : key;
      const restKeys = isKeyArray ? key.slice(1) : undefined;
      
      if (typeof this.value[keyToUse] === "undefined") {
        if (restKeys) return;

        let _value = new Value(value, variables);
        this.value[keyToUse] = _value;
        if (!_value.isValueFixed) this.isValueFixed = false;
      } else {
        this.value[keyToUse].changeValue({ key: restKeys, value, variables });
      }
    } else {
      let _value = new Value(value, variables);
      this.value = _value.isValueFixed ? value : _value;
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
        variables = Object.assign({}, variables);

        let value = {};
        for (const key in this.value) {
          let _value = this.value[key].getValue(variables);
          variables[key] = _value;
          value[key] = _value;
        }

        return value;

        // return Object.fromEntries(
        //   Object.entries(this.value).map(
        //     ([key, value]) => [key, value.getValue(variables)]
        //   )
        // );
      }
    }
  }
}

export default Value;
