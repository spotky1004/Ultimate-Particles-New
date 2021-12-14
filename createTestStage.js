import Stage from "./src/Stage.js";
import Action from "./src/Action.js";

let stageData = {
  actions: []
};

for (let i = 0; i < 10; i++) {
  /** @type {[keyof import("./src/Action.js").ActionDatas, number, import("./src/Particle").ParticleOptions]} */
  let actionData = [
    "CreateParticle",
    (i**2+1) * 250,
    {
      id: "testParticle" + (i + 1),
      variables: {
        i: i
      },
      position: {
        x: "($t/10)/(15-$i)",
        y: "($i+1)*10"
      },
      size: {
        width: "$i/2+1",
        height: "$i/2+1"
      }
    }
  ];
  stageData.actions.push(new Action(...actionData));
}

let stage = new Stage(stageData);
console.log(stage.toString());
