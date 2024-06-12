const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("gameContainer");
const gameOverScreen = document.getElementById("gameOver");
const livesCounter = document.getElementById("livesCounter");

let ballRadius = 10;
let x;
let y;
let dx;
let dy;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX;
let rightPressed = false;
let leftPressed = false;
let lives;
let level;
let levels;

const brickRowCount = 5;
const brickColumnCount = 7;
let brickWidth;
let brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];

function createBricks(level) {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: level }; // Aumenta la dificultad con el nivel
        }
    }
}

function updateLivesDisplay() {
    livesCounter.innerHTML = '❤️'.repeat(lives);
}

function initGame(selectedLevel) {
    level = selectedLevel;
    lives = 3;
    updateLivesDisplay();
    brickWidth = (canvas.width - brickOffsetLeft * 2 - (brickColumnCount - 1) * brickPadding) / brickColumnCount;
    resetBallAndPaddle();
    createBricks(level);
    dx = 2 + level;
    dy = -2 - level;
    canvas.style.display = 'block';
    menu.style.display = 'none';
    gameContainer.style.display = 'flex';
    draw();
}

function retryGame() {
    gameOverScreen.style.display = 'none';
    menu.style.display = 'block';
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function resetBallAndPaddle() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2 * (Math.random() < 0.5 ? 1 : -1);  // Dirección aleatoria en el eje X
    dy = -2 - level;
    paddleX = (canvas.width - paddleWidth) / 2;
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status--;
                    if (b.status === 0) {
                        // Check if all bricks are cleared
                        if (bricks.flat().every(brick => brick.status === 0)) {
                            level++;
                            initGame(level);
                        }
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status > 0) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].status === 1 ? "#ff0000" : "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            updateLivesDisplay();
            if (!lives) {
                canvas.style.display = 'none';
                gameContainer.style.display = 'none';
                gameOverScreen.style.display = 'block';
            } else {
                resetBallAndPaddle();
            }
        }
    }

    x += dx;
    y += dy;

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    requestAnimationFrame(draw);
}

// Generar botones de niveles en el menú
function generateLevelButtons() {
    levels = 5; // Número de niveles
    const levelSelection = document.getElementById('levelSelection');
    for (let i = 1; i <= levels; i++) {
        const button = document.createElement('button');
        button.className = 'levelButton';
        button.innerText = `Nivel ${i}`;
        button.onclick = () => initGame(i);
        levelSelection.appendChild(button);
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

generateLevelButtons();

