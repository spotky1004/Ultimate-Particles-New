import ActionSchema from "../../../class/Editor/ActionSchema.js";
import {
  Input
} from "../../../class/Util/Components/Forms/index.js";
import * as vaildiate from "../../../util/stringVaildiateFunctions.js";

const schema = new ActionSchema("ActivateActionGroup",
  (forms) => {
    return {
      name: forms.name.value
    };
  }, {
  name: new Input(/** @type {const} */ ({
    name: "Group name",
    defaultValue: "",
    hint: "Name of the group to activate"
  }))
});

export default schema;
