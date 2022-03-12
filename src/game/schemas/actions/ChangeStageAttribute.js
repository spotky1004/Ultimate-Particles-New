import ActionSchema from "../../../class/Editor/ActionSchema.js";
import {
  TypedComponents,
  Components,
  Input,
} from "../../../class/Util/Components/Forms/index.js";
import * as vaildiate from "../../../util/stringVaildiateFunctions.js";

/**
 * @param {string} defaultValue 
 * @param {"number" | "color"} type 
 */
const createAttrComponent = (name, defaultValue, type) => {
  let vaildiateFunc = undefined;
  if (type === "color") {
    vaildiateFunc = vaildiate.isHexColorOrExpression;
  } else if (type === "number") {
    vaildiateFunc = vaildiate.iNumberOrExpression;
  }
  return new Components(/** @type {const} */ ({
    forms: {
      value: new Input({
        name: "Value",
        defaultValue: defaultValue,
        hint: "New value of " + name,
        vaildiate: vaildiateFunc
      })
    }
  }));
}

const schema = new ActionSchema("ChangeStageAttribute", /** @type {const}*/ ({
  value: new TypedComponents(/** @type {const} */ ({
    name: "Value",
    components: {
      bgColor: createAttrComponent("bgColor", "#ffc966", "color"),
      screenX: createAttrComponent("screenX", "0", "number"),
      screenY: createAttrComponent("screenY", "0", "number"),
      screenWidth: createAttrComponent("screenWidth", "100", "number"),
      screenHeight: createAttrComponent("screenHeight", "100", "number"),
      screenWidthScale: createAttrComponent("screenWidthScale", "1", "number"),
      screenHeightScale: createAttrComponent("screenHeightScale", "1", "number"),
      stageY: createAttrComponent("stageY", "0", "number"),
      stageX: createAttrComponent("stageX", "0", "number"),
      stageWidthScale: createAttrComponent("stageWidthScale", "1", "number"),
      stageHeightScale: createAttrComponent("stageHeightScale", "1", "number"),
      playerHitboxFactor: createAttrComponent("playerHitboxFactor", "1", "number"),
      outOfBoundsFactor: createAttrComponent("outOfBoundsFactor", "2", "number")
    }
  }))
}));

window.s = schema;
const comp = schema.components;
window.comp = comp;
console.log(comp.element);
document.getElementById("editor").appendChild(comp.element);
setInterval(() => {
  console.log(schema.name, comp.value);
}, 500);

export default schema;
