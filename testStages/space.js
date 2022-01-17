/** @type {import("../src/class/Stage.js").StageOptions} */
let stageData = {
  maximumTickLength: 17,
  metadata: {
    author: "bu-gye-jeong",
    createDate: new Date().toGMTString(),
  },
  actions: [],
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
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "maxLife",
    value: 10,
  },
});
addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "life",
    value: 10,
  },
});
addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "maxPhase",
    value: 100,
  },
});
addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "phase",
    value: 0,
  },
});
addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "blackHoleMass",
    value: "10 * log10($phase + 2)",
  },
  looperData: {
    interval: 1000,
    loopCount: Infinity,
  },
});
addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "g",
    value: 100,
  },
});

// player
addAction({
  type: "CreateParticle",
  startTime: 0,
  data: {
    group: "player",
    color: "#f00",
    position: {
      x: 0,
      y: 0,
    },
    speed: "120",
    size: {
      height: 4,
      width: 4,
    },
  },
});
// playerZindex
addAction({
  type: "ParticleGroupEvent",
  data: {
    type: "SetZIndex",
    data: {
      zIndex: 1,
    },
    name: "player",
  },
});

// life
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
      value: "$life",
    },
  },
});
addAction({
  groupName: "particleOnHit",
  startTime: 0,
  type: "SetGlobalVariable",
  data: {
    name: "life",
    value: "$life - 1",
  },
});
addAction({
  startTime: 0,
  type: "SetGlobalVariable",
  data: {
    name: "life",
    value: "min($maxLife, $life + $dt / 2)",
  },
  looperData: {
    interval: 20,
    loopCount: Infinity,
  },
});

// phase
addAction({
  type: "AddStatus",
  startTime: 0,
  data: {
    name: "Phase",
    type: "TextProgress",
    data: {
      barStartCol: "#46cf46",
      barEndCol: "#88ff88",
      max: "$maxPhase",
      value: "$phase",
    },
  },
});
addAction({
  startTime: 0,
  type: "SetGlobalVariable",
  data: {
    name: "phase",
    value: "min($maxPhase, $phase + $dt /1.5)",
  },
  looperData: {
    interval: 20,
    loopCount: Infinity,
  },
});

// Move to player position
addAction({
  type: "ChangeStageAttribute",
  startTime: 0,
  data: {
    name: "stageX",
    value: "max(-100, (min(100, $stageX*(1-$dt) + $playerX*$dt)))",
  },
  looperData: {
    loopCount: Infinity,
  },
});
addAction({
  type: "ChangeStageAttribute",
  startTime: 0,
  data: {
    name: "stageY",
    value: "max(-100, (min(100, $stageY*(1-$dt) + $playerY*$dt)))",
  },
  looperData: {
    loopCount: Infinity,
  },
});

// set outOfBoundsFactor
addAction({
  type: "ChangeStageAttribute",
  data: {
    name: "outOfBoundsFactor",
    value: 5,
  },
});

// bg
addAction({
  type: "ChangeStageAttribute",
  startTime: 0,
  data: {
    name: "bgColor",
    value: "#000022",
  },
});
// star bg
addAction({
  startTime: 0,
  type: "CreateParticle",
  data: {
    constants: {
      spawnX: "randr(-300, 300)",
      spawnY: "randr(-300, 300)",
      size: "randr(1, 3)",
      color: "hsl(0, 0, 100)",
    },
    position: {
      x: "$spawnX",
      y: "$spawnY",
    },
    size: {
      width: "$size",
      height: "$size",
    },
    color: "$color",
    hasHitboxIf: false,
  },
  looperData: {
    innerLoop: 350,
  },
});

// particle
addAction({
  startTime: 0,
  type: "CreateParticle",
  data: {
    constants: {
      spawnX: "randr(-300, 300)",
      spawnY: "randr(-300, 300)",
      moveDeg: "randr(0, 360)",
      prevDeg: "randr(0, 360)",
      moveSpeed: 50,
      mass: 5,
      color: "hsla(randr(0, 360),50,50,20)",
    },
    variables: {
      gravityForce:
        "$g*$blackHoleMass*$mass/(($playerX-$thisX)*($playerX-$thisX)+($playerY-$thisY)*($playerY-$thisY))",
      angleToBlackHole: "atan2($playerY-$thisY,$playerX-$thisX)+90",
      prevDeg: "$moveDeg",
      moveDeg:
        "atan2($gravityForce*sin($angleToBlackHole)+$moveSpeed*sin($prevDeg),$gravityForce*cos($angleToBlackHole)+$moveSpeed*cos($prevDeg))",
      moveSpeed:
        "min(log10($phase + 2)*100, sqrt($gravityForce*$gravityForce+$moveSpeed*$moveSpeed+2*$gravityForce*$moveSpeed*cos($angleToBlackHole-$prevDeg)))",
    },
    position: {
      x: "$spawnX",
      y: "$spawnY",
    },
    deg: "$moveDeg",
    size: {
      width: 3,
      height: 3,
    },
    color: "$color",
    speed: "$moveSpeed",
    activeGroupOnHit: "particleOnHit",
  },
  looperData: {
    interval: 250,
    loopCount: Infinity,
  },
});

const stageToExport = JSON.stringify(stageData, null, 2);
console.log(stageToExport);
export default stageToExport;
