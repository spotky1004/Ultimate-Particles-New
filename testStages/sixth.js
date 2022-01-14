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
function addAction({ type, startTime, data, looperData, groupName }) {
  stageData.actions.push(arguments[0]);
}

addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "phase",
    value: 0
  }
});
addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "maxPhase",
    value: 120
  }
});

addAction({
  type: "CreateParticle",
  startTime: 0,
  data: {
    group: "player",
    color: "#eee",
    position: {
      x: 0,
      y: 0
    },
    speed: "60+$phase/2",
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
  data: {
    name: "maxLife",
    value: 3
  }
});
addAction({
  type: "SetGlobalVariable",
  data: {
    name: "maxLife",
    value: "$maxLife + $dt/400*max(1, sqrt($stageTime/10))"
  },
  looperData: {
    loopCount: Infinity,
  }
});
addAction({
  type: "SetGlobalVariable",
  data: {
    name: "life",
    value: "min($maxLife, $life + $maxLife*$dt/700)"
  },
  looperData: {
    loopCount: Infinity,
  }
});

addAction({
  type: "AddStatus",
  startTime: 0,
  data: {
    name: "Phase",
    type: "Progress",
    data: {
      value: "$phase",
      max: "$maxPhase",
      barStartCol: "hsl($stageTime*30+90, 50, 50)",
      barEndCol: "hsl($stageTime*30, 50, 50)"
    }
  }
});
addAction({
  type: "ChangeStageAttribute",
  data: {
    name: "bgColor",
    value: "#111"
  }
});

addAction({
  type: "ActivateActionGroup",
  startTime: 300,
  data: {
    name: "pattern1"
  },
  looperData: {
    interval: "2000-10*$phase",
    loopCount: "$maxPhase",
    incrementGlobal: "phase"
  }
});

// Phase
addAction({
  groupName: "pattern1",
  type: "CreateParticle",
  data: {
    constants: {
      spawnDeg: "randr(0, 360)",
      spawnX: "sin($spawnDeg)*120",
      spawnY: "cos($spawnDeg)*-120"
    },
    variables: {
      state: "min(3, $t/1000)"
    },
    position: {
      x: "$spawnX",
      y: "$spawnY"
    },
    deg: 0,
    size: {
      width: 3,
      height: 3
    },
    color: 'select($state, "#46c5e8", "#64e846", "#e88f46", "#e84646")',
    speed: "select($state, 25, 40, 55, 150)",
    tracePlayerIf: "lt($state, 3)"
  },
  looperData: {
    innerLoop: "floor($phase/10+1)"
  }
});

const stageToExport = JSON.stringify(stageData, null, 2);
console.log(stageToExport);
export default stageToExport;
