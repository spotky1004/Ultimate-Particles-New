const gameScreen = document.getElementById("game-screen");

/** @type {Object.<string, boolean>} */
export const keyPressed = {};
/** @type {boolean} */
let mouseDown = false;
const screenDragStartPos = { x: null, y: null };
const screenDragLength = { x: 0, y: 0 };
export const screenDragPower = { x: 0, y: 0, arc: Math.PI/2, power: 0 };
document.addEventListener("keydown", function (e) {
  keyPressed[e.code] = true;
});
document.addEventListener("keyup", function (e) {
  keyPressed[e.code] = false;
});
// PC
gameScreen.addEventListener("mousedown", function(e) {
  mouseDown = true;
  screenDragStartPos.x = e.clientX;
  screenDragStartPos.y = e.clientY;
  screenDragLength.x = 0;
  screenDragLength.y = 0;
  screenDragPower.x = 0;
  screenDragPower.y = 0;
  screenDragPower.power = 0;
});
document.addEventListener("mousemove", function(e) {
  if (!mouseDown) return;

  const canvasSize = Math.max(10, Math.min(gameScreen.offsetWidth, gameScreen.offsetHeight) * 0.9);
  const maxVecAt = canvasSize/5;
  
  screenDragLength.x = e.clientX - screenDragStartPos.x;
  screenDragLength.y = e.clientY - screenDragStartPos.y;
  const dragLength = Math.sqrt(screenDragLength.x**2 + screenDragLength.y**2);
  const dragPower = Math.min(1, dragLength/maxVecAt);
  const dragDeg = (Math.atan2(screenDragLength.y, screenDragLength.x)+Math.PI*2+Math.PI/2)%(Math.PI*2);
  screenDragPower.x = Math.sin(dragDeg) * dragPower;
  screenDragPower.y = -Math.cos(dragDeg) * dragPower;
  screenDragPower.arc = dragDeg;
  screenDragPower.power = dragPower;
});
document.addEventListener("mouseup", function(e) {
  mouseDown = false;
  screenDragStartPos.x = null;
  screenDragStartPos.y = null;
  screenDragLength.x = 0;
  screenDragLength.y = 0;
  screenDragPower.x = 0;
  screenDragPower.y = 0;
  screenDragPower.power = 0;
  screenDragPower.arc = Math.PI/2;
});
// Mobile
gameScreen.addEventListener("touchstart", function(e) {
  const touch = e.touches[e.touches.length - 1];
  if (touch.identifier === 0) {
    screenDragStartPos.x = touch.clientX;
    screenDragStartPos.y = touch.clientY;
    screenDragLength.x = 0;
    screenDragLength.y = 0;
    screenDragPower.x = 0;
    screenDragPower.y = 0;
    screenDragPower.power = 0;
  }
}, { passive: true });
document.addEventListener("touchmove", function(e) {
  const canvasSize = Math.max(10, Math.min(gameScreen.offsetWidth, gameScreen.offsetHeight) * 0.9);
  const maxVecAt = canvasSize/5;
  
  const changedItems = e.changedTouches;
  for (let i = 0; i < changedItems.length; i++) {
    const changedItem = changedItems[i];
    if (changedItem.identifier === 0) {
      screenDragLength.x = changedItem.clientX - screenDragStartPos.x;
      screenDragLength.y = changedItem.clientY - screenDragStartPos.y;
      const dragLength = Math.sqrt(screenDragLength.x**2 + screenDragLength.y**2);
      const dragPower = Math.min(1, dragLength/maxVecAt);
      const dragDeg = (Math.atan2(screenDragLength.y, screenDragLength.x)+Math.PI*2+Math.PI/2)%(Math.PI*2);
      screenDragPower.x = Math.sin(dragDeg) * dragPower;
      screenDragPower.y = -Math.cos(dragDeg) * dragPower;
      screenDragPower.arc = dragDeg;
      screenDragPower.power = dragPower;
    }
  }
}, { passive: true });
document.addEventListener("touchend", function(e) {
  if (e.changedTouches[0].identifier === 0) {
    screenDragStartPos.x = null;
    screenDragStartPos.y = null;
    screenDragLength.x = 0;
    screenDragLength.y = 0;
    screenDragPower.x = 0;
    screenDragPower.y = 0;
    screenDragPower.power = 0;
    screenDragPower.arc = Math.PI/2;
  }
});
document.addEventListener("blur", function (e) {
  while (screenDragStartPos.length > 0) screenDragStartPos.pop();
  while (screenDrag.length > 0) screenDrag.pop();
  while (screenDragDatas.length > 0) screenDragDatas.pop();
  for (const code in keyPressed) {
    keyPressed[code] = false;
  }
});

/** @type {HTMLDivElement} */
const dragDisplay = document.getElementById("drag-display");
/** @type {HTMLDivElement} */
const dragPowerDisplay = document.getElementById("drag-power-display");
export function renderDrags() {
  if (screenDragStartPos.x !== null) {
    dragDisplay.style.display = "";
    dragDisplay.style.left = (screenDragStartPos.x - dragDisplay.offsetWidth/2) + "px";
    dragDisplay.style.top = (screenDragStartPos.y - dragDisplay.offsetHeight/2) + "px";
    dragDisplay.style.filter = `grayscale(${(1-screenDragPower.power)**2})`;
    const deg = (screenDragPower.arc*180/Math.PI)%360 + 45;
    dragDisplay.style.transform = `scale(${1+screenDragPower.power}) rotate(${deg}deg)`;
    dragPowerDisplay.style.transform = `rotate(-${deg}deg)`;
    dragPowerDisplay.innerText = "x" + screenDragPower.power.toFixed(1);
  } else {
    dragDisplay.style.display = "none";
  }
}

const isMobile = navigator?.userAgentData?.mobile;
const fullScreenBtn = document.getElementById("full-screen-btn");
if (isMobile === true || typeof isMobile === "undefined") {
  fullScreenBtn.style.display = "";
}
fullScreenBtn.addEventListener("click", function() {
  document.documentElement.requestFullscreen();
  fullScreenBtn.style.display = "none";
});
