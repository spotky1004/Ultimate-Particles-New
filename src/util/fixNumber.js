/**
 * @param {*} value 
 * @param {number} min 
 * @param {number} max 
 * @param {number} defaultValue
 * @returns {number}
 */
function fixNumber(value, min, max, defaultValue) {
  if (
    typeof value === "number" &&
    !isNaN(value)
  ) {
    return Math.max(min, Math.min(max, value));
  }
  return defaultValue;
}

export default fixNumber;
