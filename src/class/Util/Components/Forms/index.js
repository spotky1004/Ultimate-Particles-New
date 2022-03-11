export { default as Input } from "./Input.js";
export { default as Select } from "./Select.js";
export { default as Components } from "./Components.js";
export { default as TypedComponents } from "./TypedComponents.js";

/**
 * @typedef FormOptions
 * @property {import("./Input.js").Options} Input
 * @property {import("./Select.js").Options} Select 
 * @property {import("./Components.js").Options} Components
 * @property {import("./TypedComponents.js").Options} TypedComponents
 */

/**
 * @typedef Forms
 * @property {import("./Input.js").default} Input
 * @property {import("./Select.js").default} Select
 * @property {import("./Components.js").default} Components
 * @property {import("./TypedComponents.js").default} TypedComponents
 */

/**
 * @typedef {Forms[keyof Forms]} AnyForm
 */
