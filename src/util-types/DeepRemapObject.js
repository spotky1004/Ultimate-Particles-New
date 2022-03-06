// TODO: Better HTMLElement filter

/**
 * @template T
 * @typedef {{ [K in keyof T]-? : T[K] }} CleanupObject
 */
/**
 * @template T
 * @template {keyof T} P
 * @template {keyof T} V
 * @typedef {CleanupObject<import("./UnionToIntersection.js").UnionToIntersection<DeepRemapObjectUnion<T, P, V>>>} DeepRemapObject
 */
/**
 * @template T
 * @template {keyof T} P
 * @template {keyof T} V
 * @typedef {T extends readonly any[] ? DeepRemapObject<T[number], P, V> : { [K in keyof T]-? : K extends P ? import("./CreateObject.js").CreateObj<T[P], T[V]> : never | RecursiveDeepRemapObject<T[K], P, V> }[keyof T]} DeepRemapObjectUnion
 */
/**
 * @template T
 * @template P
 * @template V
 * @typedef {T extends readonly any[] ? DeepRemapObjectUnion<T[number], P, V> : T extends HTMLElement ? never : import("./IsObject.js").IsObject<T> extends true ? DeepRemapObjectUnion<T, P, V> : never } RecursiveDeepRemapObject
 */

export default DeepRemapObject;
