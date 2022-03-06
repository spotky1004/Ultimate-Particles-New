import ActionSchema from "../../../class/Editor/ActionSchema.js";
import * as Forms from "../../../class/Util/Components/Forms/index.js";

const schema = new ActionSchema("Activate Action Group", {
  name: new Forms.Input({
    name: "Group Name",
    defaultValue: "",
    hint: "Name of the group to activate"
  })
});

console.log(schema);

export default schema;
