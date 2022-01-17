const gameScreen = document.getElementById("game-screen");

/** @type {["main", "bg", "particle", "prevEffect", "effect"]} */
const canvasLayerNames = ["main", "bg", "particle", "prevEffect", "effect"];
/**
 * @typedef {canvasLayerNames} CanvasLayerNames
 * @typedef {CanvasLayerNames[number]} CanvasLayerTypes
 */
/**
 * @typedef CanvasLayerItem
 * @property {HTMLCanvasElement} canvas
 * @property {CanvasRenderingContext2D} ctx
 */
/** @type {Record<CanvasLayerTypes, CanvasLayerItem>} */
const canvasLayer = {};
for (let i = 0; i < canvasLayerNames.length; i++) {
  const name = canvasLayerNames[i];
  canvasLayer[name] = {};
  const canvasLayerItem = canvasLayer[name];
  canvasLayerItem.canvas = document.createElement("canvas");
  canvasLayerItem.ctx = canvasLayerItem.canvas.getContext("2d");
}

const displayCanvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
const displayCtx = displayCanvas.getContext("2d");

let t = 1;
/**
 * @param {import("./class/Stage.js").default} stage 
 */
function drawCanvas(stage) {
  const viewSize = {
    height: gameScreen.offsetHeight,
    width: gameScreen.offsetWidth
  };
  const stageAttribute = stage.state.stageAttribute;
  
  const canvasSize = Math.min(viewSize.width, viewSize.height) * 0.9;
  const canvasWidth = Math.max(1, canvasSize * stageAttribute.screenSize.width/100);
  const canvasHeight = Math.max(90, canvasSize * stageAttribute.screenSize.height/100);
  for (let i = 0; i < canvasLayerNames.length; i++) {
    const canvas = canvasLayer[canvasLayerNames[i]].canvas;
    if (canvas.width !== Math.floor(canvasWidth)) canvas.width = canvasWidth;
    if (canvas.height !== Math.floor(canvasHeight)) canvas.height = canvasHeight;
  }
  const s = canvasSize/100;

  canvasLayer.bg.ctx.fillStyle = stageAttribute.bgColor || "#ffc966";
  canvasLayer.bg.ctx.fillRect(0, 0, canvas.width, canvas.height);

  const particleCanvas = canvasLayer.particle.canvas;
  const particleCtx = canvasLayer.particle.ctx;
  particleCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  const particleGroups = stage.state.particleGroups.groups;
  const groupNames = Object.keys(particleGroups);
  for (let i = groupNames.length-1; i >= 0; i--) {
    const particleGroup = particleGroups[groupNames[i]].particles;
    for (let i = 0; i < particleGroup.length; i++) {
      const drawingData = stageAttribute.getParticleDrawData(particleGroup[i]);
      particleCtx.fillStyle = drawingData.color || "#000";
      particleCtx.fillRect(
        s * drawingData.position.x,
        s * drawingData.position.y,
        s * drawingData.size.width,
        s * drawingData.size.height
      );
    }
  }

  const effectCanvas = canvasLayer.effect.canvas;
  const effectCtx = canvasLayer.effect.ctx;
  effectCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  effectCtx.globalAlpha = 0;
  effectCtx.drawImage(canvasLayer.prevEffect.canvas, 0, 0);
  effectCtx.globalAlpha = 1;
  effectCtx.drawImage(particleCanvas, 0, 0);

  canvasLayer.prevEffect.ctx.globalAlpha = 0.2;
  canvasLayer.prevEffect.ctx.drawImage(effectCanvas, 0, 0);

  const mainCtx = canvasLayer.main.ctx;
  mainCtx.drawImage(canvasLayer.bg.canvas, 0, 0);
  mainCtx.drawImage(canvasLayer.effect.canvas, 0, 0);

  displayCanvas.width = canvasWidth;
  displayCanvas.height = canvasHeight;
  displayCanvas.style.transform = `translate(${canvasSize * stageAttribute.screenX/100}px, ${canvasSize * stageAttribute.screenY/100}px)`;
  displayCtx.drawImage(canvasLayer.main.canvas, 0, 0);
}

export default drawCanvas;
