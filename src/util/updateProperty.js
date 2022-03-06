/**
 * Update property if different
 * @template T
 * @template {keyof T} U
 * @param {T} obj 
 * @param {U} propName 
 * @param {T[U]} value 
 */
export default function updateProperty(obj, propName, value) {
  if (obj[propName] !== value) {
    obj[propName] = value;
  }
  return obj;
}
