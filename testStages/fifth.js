/** @type {import("../src/class/Stage.js").StageOptions} */
let stageData = {
  maximumTickLength: 17,
  actions: []
};

/**
 * @template {import("../src/class/Actions/index.js").ActionTypes} T
 * @param {object} param0
 * @param {T} param0.type 
 * @param {number} param0.startTime 
 * @param {import("../src/class/Actions/index.js").ActionDatas[T]} param0.data 
 * @param {import("../src/class/Actions/ActionBase.js").LooperData} param0.looperData 
 * @param {string} param0.group
 */
function addAction({ type, startTime, data, looperData, group }) {
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
// addAction({
//   type: "ChangeStageAttribute",
//   startTime: 0,
//   data: {
//     name: "screenWidth",
//     value: "max(50, 100-$stageTime*10)"
//   },
//   looperData: {
//     loopCount: Infinity,
//   }
// });
// addAction({
//   type: "ChangeStageAttribute",
//   startTime: 0,
//   data: {
//     name: "screenHeight",
//     value: "max(50, 100-$stageTime*10)"
//   },
//   looperData: {
//     loopCount: Infinity,
//   }
// });
// addAction({
//   type: "ChangeStageAttribute",
//   startTime: 0,
//   data: {
//     name: "stageY",
//     value: "-($stageTime^1.6)*3"
//   },
//   looperData: {
//     loopCount: Infinity,
//   }
// });
// addAction({
//   type: "AddStatus",
//   startTime: 0,
//   data: {
//     type: "Text",
//     name: "stageY",
//     data: {
//       color: "#f88",
//       content: "fix($stageY, 2)"
//     }
//   }
// });

const stageToExport = JSON.stringify(stageData, null, 2);
console.log(stageToExport);
export default stageToExport;
