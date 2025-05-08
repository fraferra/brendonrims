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
  setupCanvas();
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to detect mobile devices
function isMobile() {
  return window.innerWidth <= 768 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Mobile-oriented maze layout - taller than it is wide with more vertical elements
const mobileWalls = [
  // Outer border - use full screen width and height
  { x: 0,   y: 0,   width: 550, height: 10 },  // Top - thinner
  { x: 0,   y: 870, width: 550, height: 10 },  // Bottom - moved down to increase height
  { x: 0,   y: 0,   width: 10,  height: 880 }, // Left - increased height
  { x: 540, y: 0,   width: 10,  height: 880 }, // Right - increased height

  // Top section - widened to use more horizontal space
  { x: 40,  y: 40,  width: 150, height: 20 },
  { x: 230, y: 40,  width: 270, height: 20 },
  { x: 40,  y: 100, width: 100, height: 20 },
  { x: 180, y: 100, width: 320, height: 20 },

  // Vertical dividers - adjusted and extended
  { x: 180, y: 40,  width: 20,  height: 60 },
  { x: 350, y: 120, width: 20,  height: 220 }, // Extended
  { x: 120, y: 180, width: 20,  height: 200 }, // Extended
  { x: 260, y: 260, width: 20,  height: 180 }, // Extended

  // Middle section with passages - adjusted for better spacing
  { x: 40,  y: 180, width: 60,  height: 20 },
  { x: 140, y: 180, width: 270, height: 20 },
  { x: 40,  y: 260, width: 180, height: 20 },
  { x: 280, y: 260, width: 190, height: 20 },

  // Ghost house - repositioned lower
  { x: 180, y: 400, width: 60,  height: 20 },  // Top left - moved down
  { x: 280, y: 400, width: 60,  height: 20 },  // Top right - moved down
  { x: 180, y: 400, width: 20,  height: 20 },  // Left top
  { x: 320, y: 400, width: 20,  height: 20 },  // Right top
  { x: 180, y: 480, width: 160, height: 20 },  // Bottom - moved down

  // New middle maze section - additional walls for more vertical complexity
  { x: 60,  y: 350, width: 100, height: 20 },
  { x: 400, y: 350, width: 90,  height: 20 },
  { x: 60,  y: 430, width: 80,  height: 20 },
  { x: 380, y: 430, width: 110, height: 20 },
  // { x: 210, y: 520, width: 130, height: 20 },

  // Lower section - adjusted to use more vertical space
  { x: 40,  y: 550, width: 160, height: 20 },
  { x: 260, y: 550, width: 210, height: 20 },
  { x: 120, y: 550, width: 20,  height: 100 },
  { x: 380, y: 550, width: 20,  height: 100 },
  { x: 40,  y: 650, width: 200, height: 20 },
  { x: 300, y: 650, width: 170, height: 20 },

  // New lower maze elements - more corridors and obstacles
  { x: 180, y: 700, width: 20,  height: 80 },
  { x: 350, y: 700, width: 20,  height: 80 },
  { x: 100, y: 720, width: 80,  height: 20 },
  { x: 370, y: 720, width: 80,  height: 20 },

  // Bottom section with wider corridors
  { x: 40,  y: 800, width: 140, height: 20 },
  { x: 240, y: 800, width: 230, height: 20 },
];

// Desktop-oriented maze layout (our existing walls array)
const desktopWalls = [
  // Outer border - Modified to create more space
  { x: 0,   y: 0,   width: 800, height: 20  }, // Top
  { x: 0,   y: 500, width: 800, height: 20  }, // Bottom - moved down to 500 (was 480)
  { x: 0,   y: 0,   width: 20,  height: 520 }, // Left - height extended
  { x: 780, y: 0,   width: 20,  height: 520 }, // Right - height extended

  // Top section - horizontals with 40px+ gaps between them
  { x: 80,  y: 60,  width: 80, height: 20 },  // Reduced width for wider passage
  { x: 200, y: 60,  width: 140, height: 20 }, // Reduced width
  { x: 400, y: 60,  width: 140, height: 20 }, // Reduced width
  { x: 600, y: 60,  width: 120, height: 20 }, // Reduced width

  // Top section - verticals - adjusted for wider passages
  { x: 160, y: 60,  width: 20,  height: 80 },
  { x: 360, y: 60,  width: 20,  height: 60 },
  { x: 560, y: 60,  width: 20,  height: 80 },

  // Middle section - horizontal walls
  { x: 60,  y: 180, width: 80, height: 20 },   // Reduced width for wider corridors
  { x: 200, y: 180, width: 110, height: 20 },  // Reduced width
  { x: 450, y: 180, width: 110, height: 20 },  // Moved right + reduced width
  { x: 600, y: 180, width: 120, height: 20 },  // Reduced width

  // Ghost house (center) - with openings on both left and right sides
  { x: 320, y: 240, width: 70, height: 20 },   // Left part of top
  { x: 450, y: 240, width: 70, height: 20 },   // Right part of top
  { x: 320, y: 240, width: 20, height: 20 },   // Left wall top part
  { x: 320, y: 290, width: 20, height: 20 },   // Left wall bottom part (creates opening)
  { x: 500, y: 240, width: 20, height: 20 },   // Right wall top part
  { x: 500, y: 290, width: 20, height: 20 },   // Right wall bottom part (maintains opening)
  { x: 320, y: 300, width: 200, height: 20 },  // Bottom wall - unchanged

  // Lower section - moved up to make more space at bottom
  { x: 60,  y: 340, width: 140, height: 20 },  // Y moved up from 360
  { x: 240, y: 340, width: 80,  height: 20 },  // Y moved up from 360
  { x: 360, y: 340, width: 80,  height: 20 },  // Y moved up from 360
  { x: 480, y: 340, width: 80,  height: 20 },  // Y moved up from 360
  { x: 600, y: 340, width: 140, height: 20 },  // Y moved up from 360

  // Lower section - vertical walls - shortened for wider passages
  { x: 160, y: 340, width: 20,  height: 70 },  // Shortened height
  { x: 240, y: 360, width: 20,  height: 50 },  // Shortened height
  { x: 360, y: 360, width: 20,  height: 50 },  // Shortened height
  { x: 480, y: 360, width: 20,  height: 50 },  // Shortened height
  { x: 600, y: 340, width: 20,  height: 70 },  // Shortened height

  // Bottom section - horizontal walls - moved up significantly for better gap
  { x: 60,  y: 410, width: 80,  height: 20 },  // Y moved up from 440
  { x: 280, y: 410, width: 100, height: 20 },  // Y moved up from 440
  { x: 420, y: 410, width: 100, height: 20 },  // Y moved up from 440
  { x: 620, y: 410, width: 120, height: 20 },  // Y moved up from 440
];

// Determine which wall layout to use
let walls = isMobile() ? mobileWalls : desktopWalls;

// Canvas size adjustment for mobile
function setupCanvas() {
  if (isMobile()) {
    canvas.width = 550; 
    canvas.height = 880;
    
    // Set explicit styling for mobile
    canvas.style.margin = '0';
    canvas.style.maxHeight = 'none';
    canvas.style.maxWidth = '100%'; // Ensure it doesn't overflow horizontally
    canvas.style.display = 'block';
    canvas.style.boxSizing = 'border-box';
    
    // Ensure container is properly set up
    const container = document.getElementById('gameContainer');
    container.style.overflow = 'hidden';
    container.style.padding = '0';
    container.style.margin = '0';
    container.style.width = '100%';
    container.style.position = 'relative';
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  scaleCanvas();
}

// Function to dynamically scale the canvas to fit the viewport
function scaleCanvas() {
  if (isMobile()) {
    // Mobile-specific scaling - increased by 15% and aligned to top
    const baseScale = Math.min(window.innerWidth / 550, window.innerHeight / 880);
    const scale = baseScale * 1.15; // Scale up by 15%
    
    // Reset any previous transformations and positioning
    canvas.style.transform = '';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.marginLeft = '0';
    canvas.style.marginTop = '0';
    canvas.style.transform = 'scale(' + scale + ')';
    canvas.style.transformOrigin = 'top left'; // Align to top left corner
    canvas.style.width = '100%';
    
    // Adjust container to align canvas to top
    const container = document.getElementById('gameContainer');
    if (container) {
      container.style.width = '100%';
      container.style.height = '100vh';
      container.style.display = 'block'; // Changed from flex to block
      container.style.position = 'relative';
      container.style.overflow = 'hidden';
      container.style.paddingTop = '0';
      container.style.paddingBottom = '15vh'; // Space for controls
      
      // Remove any wrappers
      if (document.getElementById('canvasWrapper')) {
        const wrapper = document.getElementById('canvasWrapper');
        if (wrapper && wrapper.contains(canvas)) {
          wrapper.parentNode.insertBefore(canvas, wrapper);
          wrapper.parentNode.removeChild(wrapper);
        }
      }
    }
    
    // Ensure the control panel stays at the bottom
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel) {
      controlPanel.style.bottom = '2vh';
      controlPanel.style.zIndex = '1000';
    }
  } else {
    // Desktop scaling - also increase by 15% for consistency
    const baseScale = Math.min(window.innerWidth / 800, window.innerHeight / 600);
    const scale = baseScale * 1.10;
    
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.marginLeft = '-' + (800 / 2) + 'px';
    canvas.style.marginTop = '-' + (600 / 2) + 'px';
    canvas.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
    canvas.style.transformOrigin = 'center center';
    
    const container = document.getElementById('gameContainer');
    if (container) {
      container.style.width = '100%';
      container.style.height = '100vh';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.position = 'relative';
    }
  }
}

// Call scaleCanvas on page load and whenever the window is resized
window.addEventListener('resize', scaleCanvas);
scaleCanvas();

// Game variables
let score = 0;
const winScore = 3;  // Increase if you want a longer game
let gameRunning = false;

// Pac-Man object - adjusted to be slightly smaller than corridor width
const pacman = {
  x: 40,
  y: 40,
  width: 30,  // Reduced from 40 to ensure it fits in corridors
  height: 30, // Reduced from 40 to ensure it fits in corridors
  speed: 10,
  radius: 10,
};

// Pellet object
const pellet = {
  x: 0,
  y: 0,
  width: 30,
  height: 30,
  // make it circular
  radius: 10,
};

// Ghosts: placed in the ghost house, not inside walls
const ghosts = [
  {
    x: 360, // Inside ghost house
    y: 240, 
    width: 30,
    height: 30,
    speed: 0.15,
  },
  {
    x: 440, // Inside ghost house
    y: 240,
    width: 30,
    height: 30,
    speed: 0.15,
  }
];

// Retro sprite placeholders (you can replace with actual images)
const pacmanImg = new Image();
pacmanImg.src = 'assets/custom_pacman.png';
const ghostImg = new Image();
ghostImg.src = 'assets/custom_ghost.png';

const pelletImg = new Image();
pelletImg.src = 'assets/pellet.png';


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

function checkCollisionX(r1, r2) {
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x
  );
}

function checkCollisionY(r1, r2) {
  return (
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
  );
}

// Enhanced safe pellet placement
function placePelletSafely() {
  let valid = false;
  let attempts = 0;
  const maxAttempts = 200; // Increased attempts for better chances
  const wallPadding = 20; // Increased padding from 15px to 20px

  // Set bounds based on current layout
  const bounds = isMobile() ? 
    { minX: 40, maxX: 490, minY: 40, maxY: 820 } : // Updated for taller maze
    { minX: 40, maxX: 740, minY: 40, maxY: 440 };

  while (!valid && attempts < maxAttempts) {
    attempts++;
    
    // Generate a position on the grid (multiple of 10 for better granularity)
    pellet.x = Math.floor(Math.random() * ((bounds.maxX - bounds.minX) / 10)) * 10 + bounds.minX;
    pellet.y = Math.floor(Math.random() * ((bounds.maxY - bounds.minY) / 10)) * 10 + bounds.minY;
    
    valid = true;
    
    // First check if pellet is within canvas bounds
    if (pellet.x < bounds.minX || pellet.x + pellet.width > bounds.maxX || 
        pellet.y < bounds.minY || pellet.y + pellet.height > bounds.maxY) {
      valid = false;
      continue;
    }
    
    // Check collision with any wall - keep a safe distance from walls
    for (const wall of walls) {
      const expandedWall = {
        x: wall.x - wallPadding,
        y: wall.y - wallPadding,
        width: wall.width + (wallPadding * 2),
        height: wall.height + (wallPadding * 2)
      };
      
      if (checkCollision(pellet, expandedWall)) {
        valid = false;
        break;
      }
    }
    
    // Skip checking distance from entities if we already know this isn't a valid spot
    if (!valid) continue;
    
    // Also check it's not too close to ghosts or pacman at start
    const minDistFromEntities = 80; // Reduced from 100 to give more possible positions
    if (Math.hypot(pellet.x - pacman.x, pellet.y - pacman.y) < minDistFromEntities) {
      valid = false;
      continue;
    }
    
    for (const ghost of ghosts) {
      if (Math.hypot(pellet.x - ghost.x, pellet.y - ghost.y) < minDistFromEntities) {
        valid = false;
        break;
      }
    }
  }

  // If we couldn't find a valid position after many attempts, place in known safe spot for the current layout
  if (!valid) {
    if (isMobile()) {
      // Safe spot for mobile - verified safe location
      pellet.x = 270;
      pellet.y = 170; // Adjusted to avoid collision with new wall layout
    } else {
      // Safe spot for desktop
      pellet.x = 400;
      pellet.y = 100;
    }
    
    // Verify our fallback position is actually safe
    let safetyCheck = true;
    for (const wall of walls) {
      const expandedWall = {
        x: wall.x - wallPadding,
        y: wall.y - wallPadding,
        width: wall.width + (wallPadding * 2),
        height: wall.height + (wallPadding * 2)
      };
      
      if (checkCollision(pellet, expandedWall)) {
        safetyCheck = false;
        break;
      }
    }
    
    // If our fallback isn't safe, try a few more locations
    if (!safetyCheck) {
      const safeSpots = isMobile() ? 
        [{x: 150, y: 200}, {x: 350, y: 200}, {x: 250, y: 500}] : 
        [{x: 100, y: 100}, {x: 700, y: 100}, {x: 400, y: 400}];
      
      for (const spot of safeSpots) {
        pellet.x = spot.x;
        pellet.y = spot.y;
        
        let spotIsSafe = true;
        for (const wall of walls) {
          const expandedWall = {
            x: wall.x - wallPadding,
            y: wall.y - wallPadding,
            width: wall.width + (wallPadding * 2),
            height: wall.height + (wallPadding * 2)
          };
          
          if (checkCollision(pellet, expandedWall)) {
            spotIsSafe = false;
            break;
          }
        }
        
        if (spotIsSafe) break;
      }
    }
  }
}

// Improved collision-handling move function
function movePacman(direction) {
  const prevX = pacman.x;
  const prevY = pacman.y;
  const step = pacman.speed;

  // Apply movement with padding to prevent getting too close to walls
  switch (direction) {
    case 'up':
      pacman.y -= step;
      break;
    case 'down':
      pacman.y += step;
      break;
    case 'left':
      pacman.x -= step;
      break;
    case 'right':
      pacman.x += step;
      break;
  }

  // Check if we're now colliding with any wall
  let collision = false;
  for (const wall of walls) {
    if (checkCollision(pacman, wall)) {
      collision = true;
      break;
    }
  }

  // Update the boundary check based on device type
  if (isMobile()) {
    if (pacman.x < 10 || pacman.x + pacman.width > 540 || 
        pacman.y < 10 || pacman.y + pacman.height > 860) { // Updated for taller maze
      collision = true;
    }
  } else {
    if (pacman.x < 20 || pacman.x + pacman.width > 780 || 
        pacman.y < 20 || pacman.y + pacman.height > 480) {
      collision = true;
    }
  }

  // If collision occurred, revert to previous position
  if (collision) {
    pacman.x = prevX;
    pacman.y = prevY;
  }
}

function updateGhosts() {
  for (const ghost of ghosts) {
    const prevX = ghost.x;
    const prevY = ghost.y;
    let movedHorizontally = false;
    let movedVertically = false;
    
    // Calculate distances to Pacman
    const distX = pacman.x - ghost.x;
    const distY = pacman.y - ghost.y;
    const absDistX = Math.abs(distX);
    const absDistY = Math.abs(distY);
    
    // Determine primary movement direction based on which distance is greater
    const movePrimaryVertical = absDistY > absDistX;
    
    // Try primary direction first
    if (movePrimaryVertical) {
      // Try vertical movement first
      if (distY !== 0) {
        ghost.y += Math.sign(distY) * ghost.speed;
        
        // Check for wall collision
        let hitWall = false;
        for (const wall of walls) {
          if (checkCollision(ghost, wall)) {
            ghost.y = prevY; // Revert vertical movement
            hitWall = true;
            break;
          }
        }
        
        if (!hitWall) {
          movedVertically = true;
        }
      }
      
      // Then try horizontal if vertical didn't collide or if distance is still significant
      if (distX !== 0 && (!movedVertically || absDistX > 50)) {
        ghost.x += Math.sign(distX) * ghost.speed;
        
        // Check for wall collision
        for (const wall of walls) {
          if (checkCollision(ghost, wall)) {
            ghost.x = prevX; // Revert horizontal movement
            break;
          }
        }
      }
    } 
    else {
      // Try horizontal movement first
      if (distX !== 0) {
        ghost.x += Math.sign(distX) * ghost.speed;
        
        // Check for wall collision
        let hitWall = false;
        for (const wall of walls) {
          if (checkCollision(ghost, wall)) {
            ghost.x = prevX; // Revert horizontal movement
            hitWall = true;
            break;
          }
        }
        
        if (!hitWall) {
          movedHorizontally = true;
        }
      }
      
      // Then try vertical if horizontal didn't collide or if distance is still significant
      if (distY !== 0 && (!movedHorizontally || absDistY > 50)) {
        ghost.y += Math.sign(distY) * ghost.speed;
        
        // Check for wall collision
        for (const wall of walls) {
          if (checkCollision(ghost, wall)) {
            ghost.y = prevY; // Revert vertical movement
            break;
          }
        }
      }
    }
    
    // If ghost is stuck (didn't move in either direction), try random movement
    if (ghost.x === prevX && ghost.y === prevY) {
      // Pick a random direction
      const directions = ['up', 'down', 'left', 'right'];
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      
      switch (randomDir) {
        case 'up':
          ghost.y -= ghost.speed * 2;
          break;
        case 'down':
          ghost.y += ghost.speed * 2;
          break;
        case 'left':
          ghost.x -= ghost.speed * 2;
          break;
        case 'right':
          ghost.x += ghost.speed * 2;
          break;
      }
      
      // Make sure we didn't move into a wall
      for (const wall of walls) {
        if (checkCollision(ghost, wall)) {
          ghost.x = prevX;
          ghost.y = prevY;
          break;
        }
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

  // Draw walls in less intense blue
  ctx.fillStyle = '#0033CC'; // Changed from #0000FF to a softer blue

  // Draw each wall with rounded corners for classic look
  for (const wall of walls) {
    // Draw wall with rounded corners if it's not too small
    if (wall.width >= 20 && wall.height >= 20) {
      const radius = 4; // Corner radius
      
      ctx.beginPath();
      ctx.moveTo(wall.x + radius, wall.y);
      ctx.lineTo(wall.x + wall.width - radius, wall.y);
      ctx.quadraticCurveTo(wall.x + wall.width, wall.y, wall.x + wall.width, wall.y + radius);
      ctx.lineTo(wall.x + wall.width, wall.y + wall.height - radius);
      ctx.quadraticCurveTo(wall.x + wall.width, wall.y + wall.height, wall.x + wall.width - radius, wall.y + wall.height);
      ctx.lineTo(wall.x + radius, wall.y + wall.height);
      ctx.quadraticCurveTo(wall.x, wall.y + wall.height, wall.x, wall.y + wall.height - radius);
      ctx.lineTo(wall.x, wall.y + radius);
      ctx.quadraticCurveTo(wall.x, wall.y, wall.x + radius, wall.y);
      ctx.closePath();
      
      ctx.fill();
    } else {
      // For very small walls, just use a rectangle
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
  }

  // Add grid dots for classic feel (small pellets in background)
  ctx.fillStyle = '#555555';
  const gridSize = 20;
  for (let x = 30; x < canvas.width - 30; x += gridSize) {
    for (let y = 30; y < canvas.height - 30; y += gridSize) {
      // Only draw if not colliding with a wall
      const dot = {x: x, y: y, width: 2, height: 2};
      let collision = false;
      for (const wall of walls) {
        if (checkCollision(dot, wall)) {
          collision = true;
          break;
        }
      }
      if (!collision) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
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

  if (isMobile()) {
    // Mobile starting positions - adjusted for taller maze
    pacman.x = 80; 
    pacman.y = 820; // Lower position for taller maze
    
    // Reset ghosts for mobile layout - fixed positioning to prevent getting stuck
    ghosts[0].x = 220; 
    ghosts[0].y = 440; // Inside ghost house but not on a wall
    ghosts[1].x = 280; // Fixed position so it's not stuck
    ghosts[1].y = 440; // Clear of any walls so it can move
  } else {
    // Desktop starting positions (unchanged)
    pacman.x = 50;
    pacman.y = 450;
    
    // Reset ghosts for desktop layout
    ghosts[0].x = 360;
    ghosts[0].y = 260;
    ghosts[1].x = 380;
    ghosts[1].y = 260;
  }

  placePelletSafely();
  gameRunning = true;
  gameLoop();
}

/**
*  Send Twilio SMS by calling the /win endpoint (Node.js/Express)
*  Make sure your server is set up with a POST /win route that sends the SMS
*/
function endGame() {
  gameRunning = false;
  // Show the win popup instead of using alert
  const winPopup = document.getElementById('winPopup');
  winPopup.style.display = 'flex';

  // Send message via Twilio when "SEND MESSAGE" is clicked
  document.getElementById('sendMessageBtn').addEventListener('click', function() {
    const customMessage = document.getElementById('customMessage').value.trim() || 'Rim rim Brendon! It\'s wedding timeeee!';
    const username = document.getElementById('usernameInput').value.trim();
    fetch('/win', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: customMessage,
        username: username
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
        document.getElementById('winPopup').style.display = 'none';
      })
      .catch(err => {
        console.error('Error sending SMS:', err);
      });
  });
}

function gameOver() {
  gameRunning = false;
  // Show the game over popup
  const gameOverPopup = document.getElementById('gameOverPopup');
  gameOverPopup.style.display = 'flex';

  // Allow user to restart
  document.getElementById('tryAgainBtn').addEventListener('click', function() {
    gameOverPopup.style.display = 'none';
    startGame();
  });
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
// Desktop keydown event listener
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

// ***** New Mobile Control Code for Continuous Movement *****
let moveInterval = null;

// Function to handle continuous movement while a button is pressed
function startMoving(direction) {
  if (!moveInterval) {
    moveInterval = setInterval(() => {
      movePacman(direction);
    }, 100); // Adjust this interval (in ms) for speed
  }
}

function stopMoving() {
  clearInterval(moveInterval);
  moveInterval = null;
}

// Attach touch events for each control button
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

if (upBtn) {
  upBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startMoving('up');
  });
  upBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopMoving();
  });
}

if (downBtn) {
  downBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startMoving('down');
  });
  downBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopMoving();
  });
}

if (leftBtn) {
  leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startMoving('left');
  });
  leftBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopMoving();
  });
}

if (rightBtn) {
  rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startMoving('right');
  });
  rightBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopMoving();
  });
}
// ***** End of New Mobile Control Code *****

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
