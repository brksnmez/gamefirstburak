const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 5,
};

const obstacles = [];
const obstacleWidth = 30;
const obstacleHeight = 30;
const obstacleSpeed = 2;
let score = 0;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacle(obstacle) {
    ctx.fillStyle = 'red';
    ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
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
        if (
            player.x < obstacles[i].x + obstacleWidth &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacleHeight &&
            player.y + player.height > obstacles[i].y
        ) {
            alert(`Oyun bitti AMINA KODUUM SALAĞI! Skorunuz: ${score}`);
            document.location.reload();
        }
    }
}

function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

// Mobil dokunmatik kontrolleri ekleme
canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const touchX = touch.clientX - canvas.offsetLeft;
    if (touchX > 0 && touchX < canvas.width - player.width) {
        player.x = touchX;
    }
});

updateGameArea();
