import StringExpression from "../class/Util/StringExpression.js";

/**
 * @typedef {(str: string) => boolean} VadildateFunction
 */

/** @type {VadildateFunction} */
export function isStringExpression(str) {
  return new StringExpression(str).isVaild;
}

const numberCheckRegexp = /^\d+(\.\d+)?$/;
/** @type {VadildateFunction} */
export function isStringIsNumber(str) {
  return numberCheckRegexp.test(str);
}

/** @type {VadildateFunction} */
export function isStringIsNumberOrExpression(str) {
  return isStringExpression(str) || isStringIsNumber(str);
}
