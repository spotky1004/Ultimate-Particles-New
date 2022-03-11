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

const hexColorCheckRegexp = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
/** @type {VadildateFunction} */
export function isHexColor(str) {
  return hexColorCheckRegexp.test(str);
}
