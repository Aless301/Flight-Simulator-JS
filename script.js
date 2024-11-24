// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const simpleFlightButton = document.getElementById('simpleFlightButton');
const futureModeButton = document.getElementById('futureModeButton');

// Set canvas dimensions (hidden initially)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Event listeners for menu buttons
simpleFlightButton.addEventListener('click', () => {
    startSimpleFlight();
});

futureModeButton.addEventListener('click', () => {
    alert("Mode futur : fonctionnalité à venir !");
});

// Game variables
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const LANDSCAPE_WIDTH = WIDTH * 3;
const LANDSCAPE_HEIGHT = HEIGHT * 3;

const COLORS = {
    GREEN_FIELD: "rgb(34, 139, 34)",
    BROWN_FIELD: "rgb(139, 69, 19)",
    GREY_VILLAGE: "rgb(128, 128, 128)",
    DARK_GREEN: "rgb(0, 100, 0)",
    TEXT_COLOR: "rgb(0, 0, 0)"
};

// Images
const planeImg = new Image();
planeImg.src = 'assets/player_jet.png';
const runwayImg = new Image();
runwayImg.src = 'assets/runway.png';

// Plane object
let plane = {
    x: LANDSCAPE_WIDTH / 2,
    y: LANDSCAPE_HEIGHT / 2 + 256,
    speedX: 0,
    speedY: 0,
    maxSpeed: 7,
    drag: 0.01,
    angle: 90
};

// Runway position
const runway = {
    x: LANDSCAPE_WIDTH / 2 - 52,
    y: LANDSCAPE_HEIGHT / 2 - 306
};

// Landscape
let landscapeElements = [];
let startTime;

// Initialize landscape
function generateLandscape() {
    const elements = [];
    const clearZoneMargin = 300;
    const clearZoneRect = {
        x: runway.x - clearZoneMargin,
        y: runway.y - clearZoneMargin,
        width: 104 + clearZoneMargin * 2,
        height: 612 + clearZoneMargin * 2
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
        const clusterX = Math.random() * LANDSCAPE_WIDTH;
        const clusterY = Math.random() * LANDSCAPE_HEIGHT;
        if (isInClearZone(clusterX, clusterY)) continue;

        for (let j = 0; j < Math.random() * 10 + 5; j++) {
            const x = clusterX + Math.random() * 200 - 100;
            const y = clusterY + Math.random() * 200 - 100;
            if (isInClearZone(x, y)) continue;

            const width = Math.random() * 90 + 30;
            const height = Math.random() * 60 + 20;
            const color = Math.random() > 0.5 ? COLORS.GREEN_FIELD : COLORS.BROWN_FIELD;
            elements.push({ type: "rect", color: color, x: x, y: y, width: width, height: height });
        }
    }

    for (let i = 0; i < 300; i++) {
        const x = Math.random() * LANDSCAPE_WIDTH;
        const y = Math.random() * LANDSCAPE_HEIGHT;
        if (isInClearZone(x, y)) continue;

        const width = Math.random() * 90 + 30;
        const height = Math.random() * 60 + 20;

        if (Math.random() > 0.5) {
            elements.push({ type: "forest", color: COLORS.DARK_GREEN, x: x, y: y, width: width, height: height });
        } else {
            elements.push({ type: "village", color: COLORS.GREY_VILLAGE, x: x, y: y, width: width, height: height });
        }
    }

    return elements;
}

// Start the simple flight mode
function startSimpleFlight() {
    // Hide the menu and show the canvas
    menu.style.display = 'none';
    canvas.style.display = 'block';

    // Initialize game variables
    plane = {
        x: LANDSCAPE_WIDTH / 2,
        y: LANDSCAPE_HEIGHT / 2 + 256,
        speedX: 0,
        speedY: 0,
        maxSpeed: 7,
        drag: 0.01,
        angle: 90
    };
    landscapeElements = generateLandscape();
    startTime = Date.now();

    // Start the game loop
    gameLoop();
}

// Update physics
function updatePhysics() {
    plane.speedX -= plane.drag * plane.speedX;
    plane.speedY -= plane.drag * plane.speedY;
    plane.x += plane.speedX;
    plane.y += plane.speedY;
    plane.angle = Math.atan2(plane.speedY, plane.speedX) * (180 / Math.PI);
}

// Draw functions
function drawLandscape() {
    landscapeElements.forEach((element) => {
        ctx.fillStyle = element.color;
        ctx.fillRect(
            element.x - plane.x + canvas.width / 2,
            element.y - plane.y + canvas.height / 2,
            element.width,
            element.height
        );
    });
}

function drawRunway() {
    ctx.drawImage(runwayImg, runway.x - plane.x + canvas.width / 2, runway.y - plane.y + canvas.height / 2);
}

function drawPlane() {
    const planeWidth = 60;
    const planeHeight = 40;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((plane.angle + 90) * Math.PI / 180);
    ctx.drawImage(planeImg, -planeWidth / 2, -planeHeight / 2, planeWidth, planeHeight);
    ctx.restore();
}

function displayFlightInfo() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    ctx.fillStyle = COLORS.TEXT_COLOR;
    ctx.font = "20px Arial";
    ctx.fillText(`Temps de vol : ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`, 10, 25);

    const speedKmh = Math.sqrt(plane.speedX ** 2 + plane.speedY ** 2) * 60 * 60 / 1000;
    ctx.fillText(`Vitesse : ${speedKmh.toFixed(1)} km/h`, canvas.width - 200, 25);
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePhysics();
    drawLandscape();
    drawRunway();
    drawPlane();
    displayFlightInfo();
    requestAnimationFrame(gameLoop);
}

// Controls
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') plane.speedY -= 0.1;
    if (e.key === 'ArrowDown') plane.speedY += 0.1;
    if (e.key === 'ArrowLeft') plane.speedX -= 0.1;
    if (e.key === 'ArrowRight') plane.speedX += 0.1;
});
