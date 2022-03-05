/**
 * @template T
 * @template {keyof T} P
 * @typedef {T extends readonly any[] ? DeepPickValue<T[number], P> : { [K in keyof T]-? : K extends P ? T[K] : never | RecursiveDeepPickValue<T[K], P> }[keyof T]} DeepPickValue
 */
/**
 * @template T
 * @template P
 * @typedef {T extends readonly any[] ? DeepPickValue<T[number], P> : import("./IsObject.js").IsObject<T> extends true ? DeepPickValue<T, P> : never} RecursiveDeepPickValue
 */

export default DeepPickValue;
