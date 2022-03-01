/**
 * @param {*} value 
 */
export function isValueTure(value) {
  if (
    typeof value === "undefined" ||
    value === 0 ||
    value === "" ||
    value === null ||
    value === false ||
    value === "false"
  ) return false;
  return true;
}
