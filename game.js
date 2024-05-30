const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const backgroundMusic = document.getElementById('backgroundMusic');
const gameOverMessage = document.getElementById('gameOverMessage');
const scoreSpan = document.getElementById('score');

// Canvas boyutlarını cihazın ekran boyutuna göre ayarlama
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Grafik dosyalarını yükleme
const playerImg = new Image();
const obstacleImg = new Image();
const backgroundImg = new Image();

playerImg.src = 'images/player.png';         // Oyuncu karakteri resmi (30x30 piksel)
obstacleImg.src = 'images/obstacle.png';     // Engel resmi (30x30 piksel)
backgroundImg.src = 'images/background.jpg'; // Arka plan resmi

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    speed: 40, // Oyuncu hızını artırdık
};

const obstacles = [];
const obstacleWidth = 30;
const obstacleHeight = 30;
const obstacleSpeed = 2;
let score = 0;
let gameRunning = false;

function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawObstacle(obstacle) {
    ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
}

function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
        }
    }
    if (Math.random() < 0.02) {
        const obstacleX = Math.random() * (canvas.width - obstacleWidth);
        obstacles.push({ x: obstacleX, y: -obstacleHeight });
    }
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const obstacleCenterX = obstacles[i].x + obstacleWidth / 2;
        const obstacleCenterY = obstacles[i].y + obstacleHeight / 2;

        const distanceX = playerCenterX - obstacleCenterX;
        const distanceY = playerCenterY - obstacleCenterY;

        const collisionDistance = player.width / 2 + obstacleWidth / 2 - 5;

        if (Math.abs(distanceX) < collisionDistance && Math.abs(distanceY) < collisionDistance) {
            gameOver();
        }
    }
}

function gameOver() {
    backgroundMusic.pause();
    gameOverMessage.style.display = 'block';
    scoreSpan.textContent = score;
    gameRunning = false;
}

function updateGameArea() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    updateObstacles();
    for (let i = 0; i < obstacles.length; i++) {
        drawObstacle(obstacles[i]);
    }
    checkCollision();
    requestAnimationFrame(updateGameArea);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const touchX = touch.clientX - canvas.offsetLeft;
    if (touchX > 0 && touchX < canvas.width - player.width) {
        player.x = touchX;
    }
});

startButton.addEventListener('click', () => {
    backgroundMusic.play();
    startButton.style.display = 'none';
    gameOverMessage.style.display = 'none';
    score = 0;
    obstacles.length = 0;
    player.x = canvas.width / 2 - 15;
    player.y = canvas.height - 60;
    gameRunning = true;
    updateGameArea();
});
