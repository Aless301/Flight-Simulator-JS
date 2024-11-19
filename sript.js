// Get the canvas element and set up its 2D context
// Récupère l'élément canvas et configure le contexte 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to fit the full window size
// Définit les dimensions du canvas pour qu'il occupe tout l'écran
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Dimensions of the canvas and the extended landscape
// Dimensions du canvas et du paysage étendu
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const LANDSCAPE_WIDTH = WIDTH * 3; // Landscape is 3x canvas width
const LANDSCAPE_HEIGHT = HEIGHT * 3; // Landscape is 3x canvas height

// Colors used in the simulation
// Couleurs utilisées dans la simulation
const COLORS = {
    GREEN_FIELD: "rgb(34, 139, 34)", // Green for fields
    BROWN_FIELD: "rgb(139, 69, 19)", // Brown for other fields
    GREY_VILLAGE: "rgb(128, 128, 128)", // Grey for villages
    DARK_GREEN: "rgb(0, 100, 0)", // Dark green for forests
    TEXT_COLOR: "rgb(0, 0, 0)" // Black text for UI
};

// Load images for the plane and the runway
// Charge les images pour l'avion et la piste d'atterrissage
const planeImg = new Image();
planeImg.src = 'plane.png';
const runwayImg = new Image();
runwayImg.src = 'runway.png';

// Plane's initial state
// État initial de l'avion
let plane = {
    x: LANDSCAPE_WIDTH / 2, // Start at the center of the landscape
    y: LANDSCAPE_HEIGHT / 2 + 256,
    speedX: 0, // No horizontal movement initially
    speedY: 0, // No vertical movement initially
    maxSpeed: 7, // Maximum speed limit
    drag: 0.01, // Friction effect
    angle: 90 // Initial angle (facing upwards)
};

// Runway position
// Position de la piste d'atterrissage
const runway = {
    x: LANDSCAPE_WIDTH / 2 - 52,
    y: LANDSCAPE_HEIGHT / 2 - 306
};

// Store the start time of the game
// Stocke l'heure de début du jeu
let startTime = Date.now();

// Generate the initial landscape elements
// Génère les éléments initiaux du paysage
let landscapeElements = generateLandscape();

/**
 * Generates random landscape elements (fields, forests, villages)
 * Génère des éléments de paysage aléatoires (champs, forêts, villages)
 */
function generateLandscape() {
    let elements = [];
    const clearZoneMargin = 300; // Safe zone around the runway
    const clearZoneRect = {
        x: runway.x - clearZoneMargin,
        y: runway.y - clearZoneMargin,
        width: 104 + clearZoneMargin * 2,
        height: 612 + clearZoneMargin * 2
    };

    // Check if a point is in the clear zone
    // Vérifie si un point est dans la zone dégagée
    function isInClearZone(x, y) {
        return (
            x > clearZoneRect.x &&
            x < clearZoneRect.x + clearZoneRect.width &&
            y > clearZoneRect.y &&
            y < clearZoneRect.y + clearZoneRect.height
        );
    }

    // Add clusters of fields
    // Ajoute des clusters de champs
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
            elements.push({ type: "rect", color: color, x: x, y: y, width: width, height: height });
        }
    }

    // Add forests and villages
    // Ajoute des forêts et des villages
    for (let i = 0; i < 300; i++) {
        let x = Math.random() * LANDSCAPE_WIDTH;
        let y = Math.random() * LANDSCAPE_HEIGHT;
        if (isInClearZone(x, y)) continue;

        let width = Math.random() * 90 + 30;
        let height = Math.random() * 60 + 20;

        if (Math.random() > 0.5) {
            elements.push({ type: "forest", color: COLORS.DARK_GREEN, x: x, y: y, width: width, height: height });
        } else {
            elements.push({ type: "village", color: COLORS.GREY_VILLAGE, x: x, y: y, width: width, height: height });
        }
    }

    return elements;
}

/**
 * Updates the plane's physics
 * Met à jour la physique de l'avion
 */
function updatePhysics() {
    plane.speedX -= plane.drag * plane.speedX;
    plane.speedY -= plane.drag * plane.speedY;
    plane.x += plane.speedX;
    plane.y += plane.speedY;
    plane.angle = Math.atan2(plane.speedY, plane.speedX) * (180 / Math.PI);
}

/**
 * Draws the landscape, runway, and plane
 * Dessine le paysage, la piste et l'avion
 */
function drawLandscape() { /*...*/ }
function drawRunway() { /*...*/ }
function drawPlane() { /*...*/ }

/**
 * Main game loop
 * Boucle principale du jeu
 */
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePhysics();
    drawLandscape();
    drawRunway();
    drawPlane();
    displayFlightInfo();
    requestAnimationFrame(gameLoop);
}

/**
 * Displays flight information
 * Affiche les informations de vol
 */
function displayFlightInfo() { /*...*/ }

// Listen for key presses to control the plane
// Écoute les touches du clavier pour contrôler l'avion
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') plane.speedY -= 0.1;
    if (e.key === 'ArrowDown') plane.speedY += 0.1;
    if (e.key === 'ArrowLeft') plane.speedX -= 0.1;
    if (e.key === 'ArrowRight') plane.speedX += 0.1;
    if (e.key === 'Escape') window.close();
});

// Start the game when images are loaded
// Démarre le jeu quand les images sont chargées
planeImg.onload = () => {
    runwayImg.onload = () => {
        gameLoop();
    }
};
