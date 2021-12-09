const canvas = document.getElementById("display-canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const ceil = Math.ceil;

/**
 * @param {import("./Stage.js").default} stage 
 */
function drawCanvas(stage) {
  const canvasSize = Math.min(innerWidth, innerHeight) * 0.9;
  canvas.height = canvasSize;
  canvas.width = canvasSize;
  const s = canvasSize/100;

  ctx.fillStyle = "#ffc966";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  const { particles } = stage.playingData;

  for (let v of particles) {
    const particle = v[1];
    let { width: w, height: h } = particle.size;
    const { x, y } = particle.position;
    ctx.fillStyle = particle.color;
    ctx.fillRect(
      ceil(s * (x - h/2)),
      ceil(s * (y - w/2)),
      ceil(s * w),
      ceil(s * h)
    );
  }
}

export default drawCanvas;
