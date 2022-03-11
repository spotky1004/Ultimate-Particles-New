import ActionSchema from "../../../class/Editor/ActionSchema.js";
import {
  TypedComponents,
  Components,
  Input,
} from "../../../class/Util/Components/Forms/index.js";
import * as vaildiate from "../../../util/stringVaildiateFunctions.js";

const progressComponents = new Components(/** @type {const} */ ({
  forms: {
    bgColor: new Input({
      name: "BG",
      defaultValue: "#111",
      hint: "BG of the progress",
      vaildiate: vaildiate.isHexColorOrExpression,
    }),
    barStartCol: new Input({
      name: "Bar color start",
      defaultValue: "#cf4646",
      hint: "Start color of the bar gradient",
      vaildiate: vaildiate.isHexColorOrExpression,
    }),
    barEndCol: new Input({
      name: "Bar color end",
      defaultValue: "#ff8888",
      hint: "End color of the bar gradient",
      vaildiate: vaildiate.isHexColorOrExpression,
    }),
    value: new Input({
      name: "Value",
      defaultValue: "0",
      hint: "Value of the progress",
      vaildiate: vaildiate.iNumberOrExpression,
    }),
    max: new Input({
      name: "Max value",
      defaultValue: "10",
      hint: "Max value of the progress",
      vaildiate: vaildiate.iNumberOrExpression,
    }),
  }
}));

const schema = new ActionSchema("AddStatus", {
  name: new Input({
    name: "Name",
    defaultValue: "",
    hint: "Name of the status"
  }),
  data: new TypedComponents(/** @type {const} */ ({
    name: "Type",
    components: {
      Text: new Components(/** @type {const} */ ({
        forms: {
          content: new Input({
            name: "Content",
            hint: "Text content",
            defaultValue: "",
          }),
          color: new Input({
            name: "Color",
            defaultValue: "#fff",
            hint: "Colour of the text",
            vaildiate: vaildiate.isHexColorOrExpression,
          })
        }
      })),
      Progress: progressComponents.clone(),
      TextProgress: progressComponents.clone(),
    }
  }))
});

window.s = schema;
const comp = schema.components;
window.comp = comp;
document.getElementById("editor").appendChild(comp.element);
console.log(progressComponents);

export default schema;
