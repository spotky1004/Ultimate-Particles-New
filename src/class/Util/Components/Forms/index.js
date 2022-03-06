export { default as Input } from "./Input.js";
export { default as Select } from "./Select.js";

/**
 * @typedef FormOptions
 * @property {import("./Input.js").Options} Input
 * @property {import("./Select.js").Options} Select 
 */

/**
 * @typedef Forms
 * @property {import("./Input.js").default} Input
 * @property {import("./Select.js").default} Select
 */

/**
 * @typedef {Forms[keyof Forms]} AnyForm
 */
