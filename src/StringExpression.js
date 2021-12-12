const LOGGING = false;

class StringExpression {
  /**
   * @param {number | string} expression 
   */
  constructor(expression) {
    /** @type {boolean} */
    this.rawExpression = expression;
    this.expression = StringExpression.parseExpression(expression);
    this.isVaild = this.expression !== false;

    if (LOGGING) console.log("Expression", this.expression);
  }

  /**
   * @param {string} expression 
   * @returns {array}
   */
  static parseExpression(expression) {
    const LOOP_LIMIT = 1000;
    let loops = 0;
    
    expression = "(" + expression.replace(/\s/g, "") + ")";
    if (!expression.match(/^([A-z0-9()$+\-*/%^,]|\s|\"([^"]|\")+\"|\'([^']|\')+\')+$/)) return false;

    // Find Minus
    while (true) {
      loops++;
      if (loops > LOOP_LIMIT) throw Error("Infinite loop");
      const isMinusExist = expression.match(/(\(|[+\-*/&^])-([^)+\-*/&^]+)/) !== null;
      if (!isMinusExist) break;
      expression = expression.replace(/(\(|[+\-*/&^])-([^)+\-*/&^]+)/g, "$1minus($2)")
    }

    // Find mathFunctions
    expression = expression.replace(/((?<![$"]|\w|\s)(?:[a-z][a-z0-9]*)(?![$"]|\w|\s))/g, "{$1}");
    let searchingFunctions = [];
    for (let i = 0; i < expression.length; i++) {
      let char = expression[i];
      if (char === "}") {
        searchingFunctions.push(0);
      } else if (char === "(") {
        if (searchingFunctions.includes(0)) {
          expression = expression.slice(0, i) + "<" + expression.slice(i+1);
        }
        searchingFunctions = searchingFunctions.map(v => v+1);
      } else if (char === ")") {
        searchingFunctions = searchingFunctions.map(v => v-1);
        if (searchingFunctions.includes(0)) {
          expression = expression.slice(0, i) + ">" + expression.slice(i+1);
          searchingFunctions.splice(searchingFunctions.findIndex(v => v === 0), 1);
        }
      }
      searchingFunctions = [...new Set(searchingFunctions)];
    }
    
    // Fix mathFunction
    while (expression.includes("<")) {
      loops++;
      if (loops > LOOP_LIMIT) throw Error("Infinite loop");
      expression = expression.replace(/<([^<>]+)>/g, (_, g1) => {
        return "[" + g1.replace(/((?:\[[^[\]]+\]|[^,])+)/g, "($1)") + "]"
      });
    }
    expression = expression.replace(/\[/g, "(");
    expression = expression.replace(/\]/g, ")");

    // TODO: Fix double bracket
    // while (expression.match(/\(\([^()]+\)\)/)) {
    //   expression = expression.replace(/\((\([^()]+\))\)/g, "$1")
    // }
    
    let parts = [];
    while (true) {
      loops++;
      if (loops > LOOP_LIMIT) throw Error("Infinite loop");
      let part;
      if (expression.match(/{[^{}]+}\([^()]+\)/)) {
        part = expression.match(/({[^{}]+})\(([^()]+)\)/).slice(1).join("");
        expression = expression.replace(/{[^{}]+}\([^()]+\)/, `p${parts.length}`);
      } else if (expression.match(/\(([^()]+)\)/)) {
        part = expression.match(/\(([^()]+)\)/)[1];
        expression = expression.replace(/\(([^()]+)\)/, `p${parts.length}`);
      }
      if (!part) break;
      parts.push(part);
    }

    let parsedExpression = [];
    let idxConnected = [];
    for (let i = 0; i < parts.length; i++) {
      /** @type {string} */
      const part = parts[i];
      
      if (part.includes("{")) {
        const funcName = part.match(/{([^{}]+)}/)[1];
        const funcArgs = part.match(/[^},]+/g).slice(1)
          .map(v => v.startsWith("p") ? idxConnected[v.slice(1)] : v);
        
        idxConnected.push(parsedExpression.length);
        parsedExpression.push([funcName, ...funcArgs]);
      } else {
        let splited = part.split(/([+\-/*%\^])/);

        let sorted = [];
        while (splited.length > 0 && !(splited.length === 1 && typeof splited[0] === "number")) {
          loops++;
          if (loops > LOOP_LIMIT) throw Error("Infinite loop");
          let idxToPull = splited.findIndex(v => "^".includes(v));
          if (idxToPull === -1) idxToPull = splited.findIndex(v => "*/".includes(v));
          if (idxToPull === -1) idxToPull = splited.findIndex(v => "-+%".includes(v));
          if (idxToPull === -1) {
            if (splited.length === 1) {
              sorted.push([typeof splited[0] === "string" && splited[0].startsWith("p") ? idxConnected[splited[0].slice(1)] : splited[0]]);
              splited.splice(0, 1);
            } else {
              return false;
            }
          }

          let sortedPart = splited.splice(idxToPull-1, 3);
          if (typeof sortedPart[0] === "undefined") break;
          if (typeof sortedPart[0] === "string" && sortedPart[0].startsWith("p")) sortedPart[0] = idxConnected[sortedPart[0].slice(1)];
          if (typeof sortedPart[2] === "string" && sortedPart[2].startsWith("p")) sortedPart[2] = idxConnected[sortedPart[2].slice(1)];

          sorted.push([sortedPart[1], sortedPart[0], sortedPart[2]]);
          splited = splited.slice(0, idxToPull-1)
            .concat([parsedExpression.length+sorted.length-1])
            .concat(splited.slice(idxToPull-1));
        }

        parsedExpression.push(...sorted);
        idxConnected.push(parsedExpression.length-1);
      }
    }

    return parsedExpression;
  }

  /**
   * @param {string | number} value 
   * @param {number![]} tmps 
   * @param {Object.<string, number>} variables 
   * @returns {number | string}
   */
  static parseValue(value, tmps, variables) {
    if (typeof value === "string") {
      if (value.startsWith("$")) {
        return variables[value.slice(1)];
      } else if (value.startsWith("\"")) {
        return value.slice(1, -1);
      } else {
        return Number(value);
      }
    } else {
      return tmps[value];
    }
  }

  /**
   * @param {array} part 
   * @param {number![]} tmps 
   * @param {Object.<string, number>} variables
   * @returns {number | string}
   */
  static calculatePart(part, tmps, variables) {
    part = [...part];

    let sign = part.splice(0, 1)[0];
    let args = part.slice(0).map(v => StringExpression.parseValue(v, tmps, variables));

    switch (sign) {
      case "+": return args[0] + args[1];
      case "-": return args[0] - args[1];
      case "*": return args[0] * args[1];
      case "^": return args[0] ** args[1];
      case "/": return args[0] / args[1];
      case "%": return args[0] % args[1];
      case "minus": return -args[0];
      case "sqrt": return Math.sqrt(args[0]);
      case "sin": return Math.sin(args[0]*Math.PI/180);
      case "asin": return Math.asin(args[0]*Math.PI/180);
      case "sinh": return Math.sinh(args[0]*Math.PI/180);
      case "cos": return Math.cos(args[0]*Math.PI/180);
      case "acos": return Math.acos(args[0]*Math.PI/180);
      case "cosh": return Math.cosh(args[0]*Math.PI/180);
      case "tan": return Math.tan(args[0]*Math.PI/180);
      case "atan": return Math.atan(args[0]*Math.PI/180);
      case "tanh": return Math.tanh(args[0]*Math.PI/180);
      case "atan2": return Math.atan2(args[0], args[1]);
      case "log": return Math.log(args[0]) / Math.log(args[1] || Math.E);
      case "log10": return Math.log10(args[0]);
      case "sign": return Math.sign(args[0]);
      default: return StringExpression.parseValue(sign, tmps, variables);
    }
  }

  eval(variables) {
    if (!this.isVaild) throw new Error("Cannot evaluate invaild expression");

    let tmps = new Array(this.expression.length).fill(null);
    for (let i = 0; i < this.expression.length; i++) {
      tmps[i] = StringExpression.calculatePart(
        this.expression[i],
        tmps,
        variables
      );
    }
    if (LOGGING) console.log("Results", tmps);
    return tmps[this.expression.length-1];
  }
}

export default StringExpression;


// console.log(new StringExpression("sign(-1)").eval({a: 1, b: 2}));
// console.log(new StringExpression("$input+\", World!\"").eval({input: "Hello"}));
// let v = StringExpression.parseExpression("sin((1+$a)*(sin(cos((2+3)*(4+5)*$b))+(6+$c)) + atan2($b+$c, $d*($f+$g)))");
// let v = StringExpression.parseExpression("vec3(1+1, 1+2, 1+(3+2))");
// console.log(v);

if (!(typeof window === "undefined")) window.StringExpression = StringExpression;
