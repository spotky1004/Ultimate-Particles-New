/** @type {import("../src/class/Stage.js").StageOptions} */
let stageData = {
  maximumTickLength: 17,
  metadata: {
    author: "bu-gye-jeong & spotky1004",
    description: "Gravity Simulation by bu-gye-jeong",
    createDate: "Mon, 17 Jan 2022 00:06:12 GMT",
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
 * @param {string} param0.groupName
 */
function addAction({ type, startTime, data, looperData, groupName }) {
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
    value: 120,
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
    value: 20,
  }
});
addAction({
  type: "SetGlobalVariable",
  startTime: 0,
  data: {
    name: "g",
    value: 50,
  },
});

addAction({
  type: "ChangeStageAttribute",
  data: {
    name: "stageWidthScale",
    value: 0.5
  }
});
addAction({
  type: "ChangeStageAttribute",
  data: {
    name: "stageHeightScale",
    value: 0.5
  }
});

// player
addAction({
  type: "CreateParticle",
  startTime: 0,
  data: {
    group: "player",
    color: "#68b9f7",
    position: {
      x: 50,
      y: 50,
    },
    deg: "watch($thisX, $thisY, 0, 0)+(90-$phase/3)",
    speed: 80,
    size: {
      height: 6,
      width: 6,
    },
  },
});

// player orbit
addAction({
  type: "SetGlobalVariable",
  data: {
    name: "playerDist",
    value: "sqrt($playerX^2 + $playerY^2)"
  },
  looperData: {
    loopCount: Infinity,
  }
});
addAction({
  type: "CreateParticle",
  data: {
    group: "orbit",
    variables: {
      degAt: "$i*5-$t/200",
    },
    hasHitboxIf: "false",
    position: {
      x: "sin($degAt)*$playerDist",
      y: "cos($degAt)*-1*$playerDist"
    },
    size: {
      width: 3,
      height: 3
    },
    color: "hsla($degAt, 50, 50, 0.2)",
  },
  looperData: {
    interval: 0,
    loopCount: 72
  }
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

// blackhole
addAction({
  type: "CreateParticle",
  data: {
    group: "blackhole",
    variables: {
      posDeg: "randr(0, 360)",
      posDist: "randr(0, 30+$phase/6)",
    },
    position: {
      x: "sin($posDeg)*$posDist",
      y: "cos($posDeg)*-$posDist",
    },
    size: {
      width: "randr(4, 10)",
      height: "randr(4, 10)",
    },
    color: "hsla(0, $posDist+$phase/2, 100-$posDist*2, 1)",
  },
  looperData: {
    interval: 0,
    loopCount: 180,
  }
});
addAction({
  type: "ParticleGroupEvent",
  data: {
    type: "SetZIndex",
    data: {
      zIndex: 1,
    },
    name: "blackhole",
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

// set outOfBoundsFactor
addAction({
  type: "ChangeStageAttribute",
  data: {
    name: "outOfBoundsFactor",
    value: 1.5,
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
      twinkleOffset: "randr(0, 360)"
    },
    position: {
      x: "$spawnX",
      y: "$spawnY",
    },
    size: {
      width: "$size",
      height: "$size",
    },
    color: "hsla(0, 0, 50+abs(sin($t/10+$twinkleOffset))*50%50, 0.4)",
    hasHitboxIf: false,
  },
  looperData: {
    innerLoop: 350,
  },
});

// phase
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
  type: "ActivateActionGroup",
  data: {
    name: "onPhase"
  },
  looperData: {
    interval: 2000,
    loopCount: Infinity,
    shouldPerform: "lt($phase, $maxPhase)"
  },
})
addAction({
  groupName: "onPhase",
  startTime: 0,
  type: "SetGlobalVariable",
  data: {
    name: "phase",
    value: "min($maxPhase, $phase+1)",
  }
});

// dust
addAction({
  groupName: "onPhase",
  startTime: 0,
  type: "CreateParticle",
  data: {
    group: "dust",
    constants: {
      spawnDeg: "randr(0, 360)",
      spawnX: "sin($spawnDeg)*280",
      spawnY: "cos($spawnDeg)*-280",
      moveDeg: "randr(0, 360)",
      prevDeg: "randr(0, 360)",
      moveSpeed: 50,
      mass: "randr(4, 8)",
    },
    variables: {
      gravityForce:
        "$g*$blackHoleMass*$mass/((-$thisX)*(-$thisX)+(-$thisY)*(-$thisY))",
      angleToBlackHole: "atan2(-$thisY,-$thisX)+90",
      prevDeg: "$moveDeg",
      moveDeg:
        "atan2($gravityForce*sin($angleToBlackHole)+$moveSpeed*sin($prevDeg),$gravityForce*cos($angleToBlackHole)+$moveSpeed*cos($prevDeg))",
      moveSpeed:
        "min(500, sqrt($gravityForce*$gravityForce+$moveSpeed*$moveSpeed+2*$gravityForce*$moveSpeed*cos($angleToBlackHole-$prevDeg)))",
    },
    position: {
      x: "$spawnX",
      y: "$spawnY",
    },
    deg: "$moveDeg",
    size: {
      width: "$mass",
      height: "$mass",
    },
    color: "hsl(0, 85, 40+sin($t/3)*10)",
    speed: "$moveSpeed",
    activeGroupOnHit: "particleOnHit",
  },
  looperData: {
    interval: 0,
    loopCount: "5+$phase"
  },
});
addAction({
  type: "ParticleGroupEvent",
  data: {
    type: "SetZIndex",
    data: {
      zIndex: 3,
    },
    name: "dust",
  },
});

// particleOnHit
addAction({
  groupName: "particleOnHit",
  type: "SetGlobalVariable",
  data: {
    name: "life",
    value: "$life - 1"
  }
});
addAction({
  groupName: "particleOnHit",
  startTime: 0,
  type: "ChangeStageAttribute",
  data: {
    name: "screenX",
    value: "randr(-5*0.8^$i, 5*0.8^$i)"
  },
  looperData: {
    interval: 20,
    loopCount: 100,
  }
});
addAction({
  groupName: "particleOnHit",
  startTime: 0,
  type: "ChangeStageAttribute",
  data: {
    name: "screenY",
    value: "randr(-5*0.8^$i, 5*0.8^$i)"
  },
  looperData: {
    interval: 20,
    loopCount: 100,
  }
});


const stageToExport = JSON.stringify(stageData, null, 2);
console.log(stageToExport);
export default stageToExport;
