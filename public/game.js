/******************************************************
 * CLASSIC PAC-MAN–INSPIRED GAME (ADAPTED FOR BIGGER SPRITES)
 * + Twilio SMS Logic on Win
 ******************************************************/
document.addEventListener('DOMContentLoaded', () => {
    // All event listener registrations here
    document.getElementById('startGame').addEventListener('click', () => {
      console.log('Start button clicked');
      const username = document.getElementById('usernameInput').value.trim();
      if (username) {
        document.getElementById('usernamePrompt').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        startGame();
      } else {
        alert('Please enter a username.');
      }
    });
    
    // (Other event listeners for mobile controls, etc.)
  });
  
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
const winScore = 5;  // Increase if you want a longer game
let gameRunning = false;

// Pac-Man object
const pacman = {
  x: 100, // Safe starting X so he's not stuck in a wall
  y: 120, // Safe starting Y
  width: 40,
  height: 40,
  speed: 10 // Moves 10px per key press
};

// Pellet object
const pellet = {
  x: 0,
  y: 0,
  width: 20,
  height: 20
};

/*
  Walls array: 
  - Outer border: 20 px thick around a 800×600 canvas
  - Interior walls: 20 px thick lines spaced so 40×40 sprites can pass
  - A central "ghost house" with a 40 px wide "door" so ghosts can leave
*/
const walls = [
  // Outer border (20 px thick)
  { x: 0,   y: 0,   width: 800, height: 20  },
  { x: 0,   y: 580, width: 800, height: 20  },
  { x: 0,   y: 0,   width: 20,  height: 600 },
  { x: 780, y: 0,   width: 20,  height: 600 },

  // Horizontal walls
  { x: 60,  y: 80,  width: 300, height: 20 },
  { x: 440, y: 80,  width: 300, height: 20 },
  { x: 60,  y: 160, width: 300, height: 20 },
  { x: 440, y: 160, width: 300, height: 20 },
  { x: 60,  y: 240, width: 300, height: 20 },
  { x: 440, y: 240, width: 300, height: 20 },

  // Ghost house (center)
  { x: 360, y: 280, width: 40, height: 20 },
  { x: 440, y: 280, width: 40, height: 20 },
  { x: 330, y: 300, width: 20, height: 60 },
  { x: 480, y: 300, width: 20, height: 60 }
];

// Ghosts: 40×40, placed inside the ghost house, with a bit faster speed
const ghosts = [
  {
    x: 370,
    y: 320,
    width: 40,
    height: 40,
    speed: 0.6
  },
  {
    x: 420,
    y: 320,
    width: 40,
    height: 40,
    speed: 0.6
  }
];

// Retro sprite placeholders (you can replace with actual images)
const pacmanImg = new Image();
pacmanImg.src = 'assets/custom_pacman.png';

const ghostImg = new Image();
ghostImg.src = 'assets/custom_ghost.png';

const pelletImg = new Image();
pelletImg.src = 'assets/custom_pellet.webp';

/********************
 * HELPER FUNCTIONS
 ********************/

// Check for collision between two rectangles
function checkCollision(r1, r2) {
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  );
}

// Randomly place the pellet in a location not colliding with walls
function placePelletSafely() {
  let valid = false;
  while (!valid) {
    pellet.x = Math.random() * (canvas.width - pellet.width - 40) + 20;
    pellet.y = Math.random() * (canvas.height - pellet.height - 40) + 20;
    valid = true;
    // Check collision with any wall
    for (const wall of walls) {
      if (checkCollision(pellet, wall)) {
        valid = false;
        break;
      }
    }
  }
}

// Move Pac-Man one discrete step in the given direction
function movePacman(direction) {
  const prevX = pacman.x;
  const prevY = pacman.y;

  switch (direction) {
    case 'up':
      pacman.y -= pacman.speed;
      break;
    case 'down':
      pacman.y += pacman.speed;
      break;
    case 'left':
      pacman.x -= pacman.speed;
      break;
    case 'right':
      pacman.x += pacman.speed;
      break;
  }

  // Check collisions with walls. If collision, revert movement
  for (const wall of walls) {
    if (checkCollision(pacman, wall)) {
      pacman.x = prevX;
      pacman.y = prevY;
      break;
    }
  }
}

// Update ghost positions: simple chase toward Pac-Man, revert if hitting walls
function updateGhosts() {
  for (const ghost of ghosts) {
    const prevX = ghost.x;
    const prevY = ghost.y;

    // Move ghost toward Pac-Man
    if (ghost.x < pacman.x) ghost.x += ghost.speed;
    if (ghost.x > pacman.x) ghost.x -= ghost.speed;
    if (ghost.y < pacman.y) ghost.y += ghost.speed;
    if (ghost.y > pacman.y) ghost.y -= ghost.speed;

    // If ghost collides with walls, revert
    for (const wall of walls) {
      if (checkCollision(ghost, wall)) {
        ghost.x = prevX;
        ghost.y = prevY;
        break;
      }
    }
  }
}

/********************
 * MAIN GAME LOGIC
 ********************/

function updateGame() {
  // Update ghosts
  updateGhosts();

  // Check if Pac-Man eats pellet
  if (checkCollision(pacman, pellet)) {
    score++;
    placePelletSafely();
    if (score >= winScore) {
      endGame();
      return;
    }
  }

  // Check if any ghost catches Pac-Man
  for (const ghost of ghosts) {
    if (checkCollision(pacman, ghost)) {
      gameOver();
      return;
    }
  }
}

function drawGame() {
  // Fill background black
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw walls in bright blue to mimic the classic style
  ctx.fillStyle = '#00bfff'; // bright “neon” blue
  for (const wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  }

  // Draw pellet
  if (pelletImg.complete) {
    ctx.drawImage(pelletImg, pellet.x, pellet.y, pellet.width, pellet.height);
  } else {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(pellet.x, pellet.y, pellet.width, pellet.height);
  }

  // Draw Pac-Man
  if (pacmanImg.complete) {
    ctx.drawImage(pacmanImg, pacman.x, pacman.y, pacman.width, pacman.height);
  } else {
    // Fallback: draw a yellow circle
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x + pacman.width / 2, pacman.y + pacman.height / 2, pacman.width / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw ghosts
  for (const ghost of ghosts) {
    if (ghostImg.complete) {
      ctx.drawImage(ghostImg, ghost.x, ghost.y, ghost.width, ghost.height);
    } else {
      // Fallback: red square
      ctx.fillStyle = 'red';
      ctx.fillRect(ghost.x, ghost.y, ghost.width, ghost.height);
    }
  }

  // Draw score in a retro yellow
  ctx.fillStyle = 'yellow';
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.fillText(`Score: ${score}`, 30, 40);
}

function gameLoop() {
  if (!gameRunning) return;
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  score = 0;
  pacman.x = 100; // safe spot
  pacman.y = 120; // safe spot

  // Place pellet in a safe, reachable location
  placePelletSafely();

  // Reset ghosts inside ghost house
  ghosts[0].x = 370;
  ghosts[0].y = 320;
  ghosts[1].x = 420;
  ghosts[1].y = 320;

  gameRunning = true;
  gameLoop();
}

/**
 *  Send Twilio SMS by calling the /win endpoint (Node.js/Express)
 *  Make sure your server is set up with a POST /win route that sends the SMS
 */
function endGame() {
  gameRunning = false;
  alert('Congratulations, you won!');

  // Send a request to our backend to send the Twilio SMS
  fetch('/win', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Player just won the game! Congratulations!'
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      console.log('SMS sent successfully:', data);
    })
    .catch(err => {
      console.error('Error sending SMS:', err);
    });
}

function gameOver() {
  gameRunning = false;
  alert('Game Over! A ghost caught you.');
}

/********************
 * EVENT LISTENERS
 ********************/

// Move Pac-Man discretely on arrow key press
document.addEventListener('keydown', (e) => {
  let direction = null;
  switch (e.key) {
    case 'ArrowUp':
      direction = 'up';
      break;
    case 'ArrowDown':
      direction = 'down';
      break;
    case 'ArrowLeft':
      direction = 'left';
      break;
    case 'ArrowRight':
      direction = 'right';
      break;
    default:
      return;
  }
  movePacman(direction);
});

// Optional mobile controls
document.getElementById('upBtn')?.addEventListener('touchstart', () => movePacman('up'));
document.getElementById('downBtn')?.addEventListener('touchstart', () => movePacman('down'));
document.getElementById('leftBtn')?.addEventListener('touchstart', () => movePacman('left'));
document.getElementById('rightBtn')?.addEventListener('touchstart', () => movePacman('right'));

// Start game after username is entered
document.getElementById('startGame').addEventListener('click', () => {
  const username = document.getElementById('usernameInput').value.trim();
  if (username) {
    document.getElementById('usernamePrompt').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    startGame();
  } else {
    alert('Please enter a username.');
  }
});
