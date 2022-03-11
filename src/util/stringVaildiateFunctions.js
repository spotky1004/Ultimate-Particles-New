import StringExpression from "../class/Util/StringExpression.js";

/**
 * @typedef {(str: string) => boolean} VadildateFunction
 */

/** @type {VadildateFunction} */
export function isExpression(str) {
  return new StringExpression(str).isVaild;
}

const numberCheckRegexp = /^\d+(\.\d+)?$/;
/** @type {VadildateFunction} */
export function isNumber(str) {
  return numberCheckRegexp.test(str);
}

/** @type {VadildateFunction} */
export function iNumberOrExpression(str) {
  return isExpression(str) || isNumber(str);
}

const hexColorCheckRegexp = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
/** @type {VadildateFunction} */
export function isHexColor(str) {
  return hexColorCheckRegexp.test(str);
}

/** @type {VadildateFunction} */
export function isHexColorOrExpression(str) {
  return isHexColor(str) || isExpression(str);
}
