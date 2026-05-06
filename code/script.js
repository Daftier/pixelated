const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');

const tileSize = 16;
const gridWidth = canvas.width / tileSize;
const gridHeight = canvas.height / tileSize;

const player = {
  x: 2,
  y: gridHeight - 3,
  color: '#53d49f',
};

const coin = {
  x: 10,
  y: 5,
  color: '#f2b134',
};

const obstacle = {
  x: 20,
  y: 12,
  color: '#d95763',
};

let score = 0;
let isPlaying = false;
let speed = 8;
let frameCount = 0;
let vx = 0;
let vy = 0;

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawGrid() {
  ctx.fillStyle = '#0d111a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function resetGame() {
  player.x = 2;
  player.y = gridHeight - 3;
  score = 0;
  speed = 8;
  isPlaying = false;
  frameCount = 0;
  vx = 0;
  vy = 0;
  spawnCoin();
  spawnObstacle();
  scoreDisplay.textContent = `Score: ${score}`;
  messageDisplay.textContent = 'Press any arrow key to start';
}

function spawnCoin() {
  coin.x = Math.floor(Math.random() * (gridWidth - 2)) + 1;
  coin.y = Math.floor(Math.random() * (gridHeight - 4)) + 1;
}

function spawnObstacle() {
  obstacle.x = Math.floor(Math.random() * (gridWidth - 4)) + 2;
  obstacle.y = Math.floor(Math.random() * (gridHeight - 6)) + 2;
}

function update() {
  if (!isPlaying) return;

  frameCount++;
  if (frameCount % Math.max(1, 30 - speed) === 0) {
    player.x += vx;
    player.y += vy;

    player.x = Math.max(0, Math.min(gridWidth - 1, player.x));
    player.y = Math.max(0, Math.min(gridHeight - 1, player.y));

    if (player.x === coin.x && player.y === coin.y) {
      score += 10;
      speed = Math.min(18, speed + 1);
      spawnCoin();
      messageDisplay.textContent = 'Nice! Keep going.';
    }

    if (player.x === obstacle.x && player.y === obstacle.y) {
      messageDisplay.textContent = 'Game over! Press any arrow to restart.';
      isPlaying = false;
      vx = 0;
      vy = 0;
    }

    scoreDisplay.textContent = `Score: ${score}`;
  }
}

function draw() {
  drawGrid();
  drawRect(coin.x, coin.y, coin.color);
  drawRect(obstacle.x, obstacle.y, obstacle.color);
  drawRect(player.x, player.y, player.color);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key === 'ArrowUp') {
    vy = -1;
    vx = 0;
  } else if (key === 'ArrowDown') {
    vy = 1;
    vx = 0;
  } else if (key === 'ArrowLeft') {
    vx = -1;
    vy = 0;
  } else if (key === 'ArrowRight') {
    vx = 1;
    vy = 0;
  } else {
    return;
  }

  if (!isPlaying) {
    isPlaying = true;
    messageDisplay.textContent = 'Collect coins, avoid the red obstacle.';
  }
});

canvas.addEventListener('click', () => {
  if (!isPlaying) {
    resetGame();
    isPlaying = true;
    messageDisplay.textContent = 'Collect coins, avoid the red obstacle.';
  }
});

resetGame();
requestAnimationFrame(gameLoop);
