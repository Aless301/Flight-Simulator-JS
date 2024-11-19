// DOM Elements
// Éléments DOM
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const simpleFlightButton = document.getElementById("simpleFlightButton");
const futureModeButton = document.getElementById("futureModeButton");

// Set canvas dimensions (hidden initially)
// Définit les dimensions du canvas (initialement caché)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Event listeners for menu buttons
// Écouteurs d'événements pour les boutons du menu
simpleFlightButton.addEventListener("click", () => {
  startSimpleFlight();
});

futureModeButton.addEventListener("click", () => {
  alert("Mode futur : fonctionnalité à venir !");
});

/**
 * Starts the simple flight mode
 * Démarre le mode Vol Simple
 */
function startSimpleFlight() {
  // Hide the menu and show the canvas
  // Cache le menu et affiche le canvas
  menu.style.display = "none";
  canvas.style.display = "block";

  // Start the game loop
  // Lance la boucle du jeu
  gameLoop();
}

// Landscape dimensions and other constants
// Dimensions du paysage et autres constantes
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const LANDSCAPE_WIDTH = WIDTH * 3;
const LANDSCAPE_HEIGHT = HEIGHT * 3;

const COLORS = {
  GREEN_FIELD: "rgb(34, 139, 34)",
  BROWN_FIELD: "rgb(139, 69, 19)",
  GREY_VILLAGE: "rgb(128, 128, 128)",
  DARK_GREEN: "rgb(0, 100, 0)",
  TEXT_COLOR: "rgb(0, 0, 0)",
};

// Load plane and runway images
// Chargement des images d'avion et de piste
const planeImg = new Image();
planeImg.src = "plane.png";
const runwayImg = new Image();
runwayImg.src = "runway.png";

let plane = {
  x: LANDSCAPE_WIDTH / 2,
  y: LANDSCAPE_HEIGHT / 2 + 256,
  speedX: 0,
  speedY: 0,
  maxSpeed: 7,
  drag: 0.01,
  angle: 90,
};

const runway = {
  x: LANDSCAPE_WIDTH / 2 - 52,
  y: LANDSCAPE_HEIGHT / 2 - 306,
};

let startTime = Date.now();
let landscapeElements = generateLandscape();

function generateLandscape() {
  let elements = [];
  const clearZoneMargin = 300;
  const clearZoneRect = {
    x: runway.x - clearZoneMargin,
    y: runway.y - clearZoneMargin,
    width: 104 + clearZoneMargin * 2,
    height: 612 + clearZoneMargin * 2,
  };

  function isInClearZone(x, y) {
    return (
      x > clearZoneRect.x &&
      x < clearZoneRect.x + clearZoneRect.width &&
      y > clearZoneRect.y &&
      y < clearZoneRect.y + clearZoneRect.height
    );
  }

  for (let i = 0; i < 10; i++) {
    let clusterX = Math.random() * LANDSCAPE_WIDTH;
    let clusterY = Math.random() * LANDSCAPE_HEIGHT;
    if (isInClearZone(clusterX, clusterY)) continue;

    for (let j = 0; j < Math.random() * 10 + 5; j++) {
      let x = clusterX + Math.random() * 200 - 100;
      let y = clusterY + Math.random() * 200 - 100;
      if (isInClearZone(x, y)) continue;

      let width = Math.random() * 90 + 30;
      let height = Math.random() * 60 + 20;
      let color = Math.random() > 0.5 ? COLORS.GREEN_FIELD : COLORS.BROWN_FIELD;
      elements.push({
        type: "rect",
        color: color,
        x: x,
        y: y,
        width: width,
        height: height,
      });
    }
  }

  for (let i = 0; i < 300; i++) {
    let x = Math.random() * LANDSCAPE_WIDTH;
    let y = Math.random() * LANDSCAPE_HEIGHT;
    if (isInClearZone(x, y)) continue;

    let width = Math.random() * 90 + 30;
    let height = Math.random() * 60 + 20;

    if (Math.random() > 0.5) {
      elements.push({
        type: "forest",
        color: COLORS.DARK_GREEN,
        x: x,
        y: y,
        width: width,
        height: height,
      });
    } else {
      elements.push({
        type: "village",
        color: COLORS.GREY_VILLAGE,
        x: x,
        y: y,
        width: width,
        height: height,
      });
    }
  }

  return elements;
}

function updatePhysics() {
  plane.speedX -= plane.drag * plane.speedX;
  plane.speedY -= plane.drag * plane.speedY;
  plane.x += plane.speedX;
  plane.y += plane.speedY;
  plane.angle = Math.atan2(plane.speedY, plane.speedX) * (180 / Math.PI);
}

function drawLandscape() {
  /*...*/
}
function drawRunway() {
  /*...*/
}
function drawPlane() {
  /*...*/
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePhysics();
  drawLandscape();
  drawRunway();
  drawPlane();
  displayFlightInfo();
  requestAnimationFrame(gameLoop);
}

function displayFlightInfo() {
  /*...*/
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") plane.speedY -= 0.1;
  if (e.key === "ArrowDown") plane.speedY += 0.1;
  if (e.key === "ArrowLeft") plane.speedX -= 0.1;
  if (e.key === "ArrowRight") plane.speedX += 0.1;
  if (e.key === "Escape") window.close();
});

planeImg.onload = () => {
  runwayImg.onload = () => {
    console.log("Assets loaded");
  };
};
