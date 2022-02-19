/** @type {import("../src/class/Stage.js").StageOptions} */
let stageData = {
  maximumTickLength: 17,
  metadata: {
    author: "spotky1004",
    description: "terraria",
    createDate: "Sun, 30 Jan 2022 06:19:19 GMT"
  },
  actions: []
};

/**
 * @template {import("../src/class/Actions/index.js").ActionTypes} T
 * @param {object} param0
 * @param {T} param0.type 
 * @param {number} param0.startTime 
 * @param {import("../src/class/Actions/index.js").ActionDatas[T]} param0.data 
 * @param {import("../src/class/Actions/ActionBase.js").LooperData} param0.looperData 
 * @param {string} param0.groupName
 */
function addAction({ type, startTime, data, looperData, groupName }) {
  stageData.actions.push(arguments[0]);
}

addAction({
  type: "CreateParticle",
  startTime: 0,
  data: {
    group: "player",
    color: "#f00",
    position: {
      x: 0,
      y: 0
    },
    speed: 80,
    size: {
      height: 4,
      width: 4
    }
  }
});
addAction({
  type: "AddStatus",
  startTime: 0,
  data: {
    name: "Life",
    type: "Progress",
    data: {
      barStartCol: "#cf4646",
      barEndCol: "#ff8888",
      max: "$maxLife",
      value: "$life"
    }
  }
});

addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "gridPos",
    value: "0"
  }
});
addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "gridPos",
    value: "0"
  }
});

const stageToExport = JSON.stringify(stageData, null, 2);
console.log(stageToExport);
export default stageToExport;
