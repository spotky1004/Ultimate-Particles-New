import ActionSchema from "../../../class/Editor/ActionSchema.js";
import {
  Input
} from "../../../class/Util/Components/Forms/index.js";

const schema = new ActionSchema("Activate Action Group", {
  name: new Input(/** @type {const} */ ({
    name: "group name",
    defaultValue: "",
    hint: "Name of the group to activate"
  }))
});

export default schema;
