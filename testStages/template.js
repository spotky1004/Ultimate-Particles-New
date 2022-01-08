/** @type {import("../src/class/Stage.js").StageOptions} */
let stageData = {
  maximumTickLength: 17,
  actions: []
};

/**
 * @template {import("../src/class/Actions/index.js").ActionType} T
 * @param {T} type 
 * @param {number} startTime 
 * @param {import("../src/class/Actions/index.js").ActionDatas[T]} data 
 * @param {import("../src/class/Actions/ActionBase.js").LooperData} looperData 
 */
function addAction(type, startTime, data, looperData) {
  const actionData = {type, startTime, data, looperData};
  stageData.actions.push(actionData);
}

addAction(
  "CreateParticle",
  0,
  {
    group: "player",
    color: "#f00",
    position: {
      x: 50,
      y: 50
    },
    speed: 40,
    size: {
      height: 2,
      width: 2
    }
  }
);
addAction(
  "AddStatus",
  0,
  {
    name: "Life",
    type: "Progress",
    data: {
      barStartCol: "#cf4646",
      barEndCol: "#ff8888",
      max: "$maxLife",
      value: "$life"
    }
  }
);

const stageToExport = JSON.stringify(stageData, null, 2);
console.log(stageToExport);
export default stageToExport;
