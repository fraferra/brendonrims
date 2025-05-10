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
  
  // Set up control buttons for mobile
  setupControlButtons();
  
  // Set up the canvas
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
    
    // Show the control panel on mobile with proper styling - Adding !important to override any CSS rules
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel) {
      controlPanel.style.cssText = `
        display: flex !important;
        position: fixed !important;
        bottom: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 1000 !important;
        padding: 15px !important;
        border-radius: 15px !important;
        width: 90% !important;
        max-width: 350px !important;
        justify-content: space-around !important;
      `;
      
      // Apply non-selectable properties to all control buttons
      const controlButtons = document.querySelectorAll('.control-btn');
      controlButtons.forEach(btn => {
        btn.style.cssText = `
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          -webkit-touch-callout: none !important;
          touch-action: manipulation !important;
          cursor: pointer !important;
          -webkit-tap-highlight-color: transparent !important;
        `;
        
        // Add event listeners that prevent default behavior
        btn.addEventListener('touchstart', function(e) {
          e.preventDefault();
        }, { passive: false });
        
        btn.addEventListener('touchend', function(e) {
          e.preventDefault();
        }, { passive: false });
      });
    }
  }
  scaleCanvas();
}

// Function to dynamically scale the canvas to fit the viewport
function scaleCanvas() {
  if (isMobile()) {
    // Mobile-specific scaling - increased by 15% and aligned to top
    const baseScale = Math.min(window.innerWidth / 550, window.innerHeight / 880);
    const scale = baseScale * 1.25; // Scale up by 15%
    
    // Reset any previous transformations and positioning
    canvas.style.transform = '';
    canvas.style.position = 'absolute';
    canvas.style.top = '-20px'; // Move canvas up by 20px to create more space at bottom
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
      container.style.display = 'block'; 
      container.style.position = 'relative';
      container.style.overflow = 'hidden';
      container.style.paddingTop = '0';
      container.style.paddingBottom = '150px'; // Increased padding for controls
      
      // Remove any wrappers
      if (document.getElementById('canvasWrapper')) {
        const wrapper = document.getElementById('canvasWrapper');
        if (wrapper && wrapper.contains(canvas)) {
          wrapper.parentNode.insertBefore(canvas, wrapper);
          wrapper.parentNode.removeChild(wrapper);
        }
      }
    }
    
    // Show the control panel on mobile with proper styling - Adding !important to override any CSS rules
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel) {
      controlPanel.style.cssText = `
        display: flex !important;
        position: fixed !important;
        bottom: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 1000 !important;
        background-color: transparent !important;
        padding: 15px !important;
        border-radius: 15px !important;
        width: 90% !important;
        max-width: 350px !important;
        justify-content: space-around !important;
      `;
      
      // Apply non-selectable properties to all control buttons
      const controlButtons = document.querySelectorAll('.control-btn');
      controlButtons.forEach(btn => {
        btn.style.cssText = `
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          -webkit-touch-callout: none !important;
          touch-action: manipulation !important;
          cursor: pointer !important;
          -webkit-tap-highlight-color: transparent !important;
        `;
        
        // Add event listeners that prevent default behavior
        btn.addEventListener('touchstart', function(e) {
          e.preventDefault();
        }, { passive: false });
        
        btn.addEventListener('touchend', function(e) {
          e.preventDefault();
        }, { passive: false });
      });
    }
  } else {
    // Desktop scaling - set canvas to fixed size and center it
    canvas.width = 800;
    canvas.height = 520;
    
    // Reset any previous transformations and positioning
    canvas.style.transform = '';
    canvas.style.position = 'relative';
    canvas.style.left = 'auto';
    canvas.style.top = 'auto';
    canvas.style.margin = '0 auto';
    canvas.style.display = 'block';
    
    // Calculate scale that preserves aspect ratio and fits the viewport
    const scaleX = window.innerWidth / (canvas.width * 1.1); // Add 10% margin
    const scaleY = window.innerHeight / (canvas.height * 1.2); // Add 20% margin
    const scale = Math.min(scaleX, scaleY, 1); // Never scale up, only down if needed
    
    if (scale < 1) {
      canvas.style.transform = 'scale(' + scale + ')';
    }
    
    canvas.style.transformOrigin = 'center center';
    
    // Style the container to center the canvas
    const container = document.getElementById('gameContainer');
    if (container) {
      container.style.width = '100%';
      container.style.height = '100vh';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.position = 'relative';
      container.style.overflow = 'hidden';
    }
  }
}

// Call scaleCanvas on page load and whenever the window is resized
window.addEventListener('resize', scaleCanvas);
window.addEventListener('load', () => {
  // Set canvas sizes based on layout
  if (!isMobile()) {
    canvas.width = 800;
    canvas.height = 520;
  }
  scaleCanvas();
});

// Set up control button event listeners
function setupControlButtons() {
  // Add touch event listeners for mobile control buttons
  const upBtn = document.getElementById('upBtn');
  const downBtn = document.getElementById('downBtn');
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  
  // Set up touch events for all buttons
  if (upBtn) {
    upBtn.addEventListener('touchstart', () => startMoving('up'), false);
    upBtn.addEventListener('touchend', stopMoving, false);
    upBtn.addEventListener('mousedown', () => startMoving('up'), false);
    upBtn.addEventListener('mouseup', stopMoving, false);
    upBtn.addEventListener('mouseleave', stopMoving, false);
  }
  
  if (downBtn) {
    downBtn.addEventListener('touchstart', () => startMoving('down'), false);
    downBtn.addEventListener('touchend', stopMoving, false);
    downBtn.addEventListener('mousedown', () => startMoving('down'), false);
    downBtn.addEventListener('mouseup', stopMoving, false);
    downBtn.addEventListener('mouseleave', stopMoving, false);
  }
  
  if (leftBtn) {
    leftBtn.addEventListener('touchstart', () => startMoving('left'), false);
    leftBtn.addEventListener('touchend', stopMoving, false);
    leftBtn.addEventListener('mousedown', () => startMoving('left'), false);
    leftBtn.addEventListener('mouseup', stopMoving, false);
    leftBtn.addEventListener('mouseleave', stopMoving, false);
  }
  
  if (rightBtn) {
    rightBtn.addEventListener('touchstart', () => startMoving('right'), false);
    rightBtn.addEventListener('touchend', stopMoving, false);
    rightBtn.addEventListener('mousedown', () => startMoving('right'), false);
    rightBtn.addEventListener('mouseup', stopMoving, false);
    rightBtn.addEventListener('mouseleave', stopMoving, false);
  }
}

// Game variables
let score = 0;
const winScore = 5;  // Already set to 5 pellets to win
let gameRunning = false;
let lives = 3; // Player starts with 3 lives
let ghostsCanShoot = false; // Will be enabled after 2 pellets
let ghostFireballs = []; // Array to store active fireballs
let lastPositionReset = 0; // Timestamp of last position reset
const maxGhosts = 10; // Limit the total number of ghosts to prevent excessive difficulty

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
const ghosts = [];

// Load heart/ring image for lives
const heartImg = new Image();
heartImg.src = 'assets/heart.png'; // Make sure this image exists in your assets folder

// Fireball image
const fireballImg = new Image();
fireballImg.src = 'assets/fireball.png'; // Make sure this image exists in your assets folder

// Retro sprite placeholders (you can replace with actual images)
const pacmanImg = new Image();
pacmanImg.src = 'assets/custom_pacman.png';
const ghostImg = new Image();
ghostImg.src = 'assets/gotyou.png';

// Easter egg ghost image
const specialGhostImg = new Image();
specialGhostImg.src = 'assets/ghost2.png'; // Using this as the special ghost image

const pelletImg = new Image();
pelletImg.src = 'assets/pellet.png';

// Easter egg tracking
let easterEggTriggered = false;

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

// Calculate Euclidean distance between two points
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Convert a position to a grid cell
function positionToGridCell(x, y, cellSize) {
  return {
    col: Math.floor(x / cellSize),
    row: Math.floor(y / cellSize)
  };
}

// Check if a grid cell contains a wall
function isCellBlocked(col, row, cellSize) {
  // Create a test point in the center of the cell
  const testPoint = {
    x: col * cellSize + cellSize / 2,
    y: row * cellSize + cellSize / 2,
    width: cellSize - 2, // Almost full cell size
    height: cellSize - 2
  };
  
  // Check collision with any wall
  for (const wall of walls) {
    if (checkCollision(testPoint, wall)) {
      return true;
    }
  }
  
  // Check boundaries
  if (isMobile()) {
    if (testPoint.x < 10 || testPoint.x + testPoint.width > 540 || 
        testPoint.y < 10 || testPoint.y + testPoint.height > 860) {
      return true;
    }
  } else {
    if (testPoint.x < 20 || testPoint.x + testPoint.width > 780 || 
        testPoint.y < 20 || testPoint.y + testPoint.height > 480) {
      return true;
    }
  }
  
  return false;
}

// Build adjacency list representing the game grid
function buildAdjacencyGraph(cellSize) {
  const graph = {};
  const maxCol = isMobile() ? Math.ceil(550 / cellSize) : Math.ceil(800 / cellSize);
  const maxRow = isMobile() ? Math.ceil(880 / cellSize) : Math.ceil(520 / cellSize);
  
  // Create nodes for all non-blocked cells
  for (let col = 0; col < maxCol; col++) {
    for (let row = 0; row < maxRow; row++) {
      if (!isCellBlocked(col, row, cellSize)) {
        const nodeId = `${col},${row}`;
        graph[nodeId] = [];
        
        // Check all 4 adjacent cells and add edges if they're not blocked
        const directions = [
          { dc: 0, dr: -1 }, // up
          { dc: 1, dr: 0 },  // right
          { dc: 0, dr: 1 },  // down
          { dc: -1, dr: 0 }  // left
        ];
        
        for (const dir of directions) {
          const adjCol = col + dir.dc;
          const adjRow = row + dir.dr;
          
          if (adjCol >= 0 && adjCol < maxCol && adjRow >= 0 && adjRow < maxRow && 
              !isCellBlocked(adjCol, adjRow, cellSize)) {
            const adjNodeId = `${adjCol},${adjRow}`;
            graph[nodeId].push({
              id: adjNodeId,
              weight: 1  // All adjacent cells have the same weight of 1
            });
          }
        }
      }
    }
  }
  
  return graph;
}

// Implementation of Dijkstra's algorithm
function dijkstra(graph, startNodeId, endNodeId) {
  // Priority queue to store nodes to visit
  const queue = [];
  
  // Distances from start node to each node
  const distances = {};
  
  // Previous node in the optimal path
  const previous = {};
  
  // Initialize all nodes with infinite distance
  for (const nodeId in graph) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  }
  
  // Distance to start is 0
  distances[startNodeId] = 0;
  queue.push({ id: startNodeId, priority: 0 });
  
  while (queue.length > 0) {
    // Sort queue by priority (distance)
    queue.sort((a, b) => a.priority - b.priority);
    
    // Get the node with the smallest distance
    const current = queue.shift();
    
    // If we reached the target, we're done
    if (current.id === endNodeId) {
      break;
    }
    
    // Process each neighbor
    for (const neighbor of graph[current.id] || []) {
      // Calculate new distance
      const alt = distances[current.id] + neighbor.weight;
      
      // If we found a better path
      if (alt < distances[neighbor.id]) {
        distances[neighbor.id] = alt;
        previous[neighbor.id] = current.id;
        
        // Add to queue with updated priority
        queue.push({ id: neighbor.id, priority: alt });
      }
    }
  }
  
  // Reconstruct path
  const path = [];
  let current = endNodeId;
  
  // If end node is unreachable
  if (previous[current] === null && current !== startNodeId) {
    return null; // No path exists
  }
  
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  return path;
}

// Get direction from path
function getDirectionFromPath(path, ghost, cellSize) {
  if (!path || path.length < 2) {
    return null;
  }
  
  // Current position in grid coordinates
  const [currentCol, currentRow] = path[0].split(',').map(Number);
  
  // Next position in grid coordinates
  const [nextCol, nextRow] = path[1].split(',').map(Number);
  
  // Determine direction
  if (nextCol > currentCol) return 'right';
  if (nextCol < currentCol) return 'left';
  if (nextRow > currentRow) return 'down';
  if (nextRow < currentRow) return 'up';
  
  return null;
}

// Main function to find best direction using Dijkstra's algorithm
function findBestDirection(ghost, targetX, targetY) {
  const cellSize = 20; // Size of each grid cell
  
  // Convert ghost and target positions to grid cells
  const ghostCell = positionToGridCell(ghost.x, ghost.y, cellSize);
  const targetCell = positionToGridCell(targetX, targetY, cellSize);
  
  // Build the graph if it hasn't been built yet or needs to be updated
  if (!window.gameGraph || !window.lastGraphUpdateTime || 
      Date.now() - window.lastGraphUpdateTime > 5000) { // Update graph every 5 seconds
    window.gameGraph = buildAdjacencyGraph(cellSize);
    window.lastGraphUpdateTime = Date.now();
  }
  
  // Ghost's current position as string ID
  const startNodeId = `${ghostCell.col},${ghostCell.row}`;
  
  // Target position as string ID
  const endNodeId = `${targetCell.col},${targetCell.row}`;
  
  // Find the shortest path using Dijkstra's algorithm
  const path = dijkstra(window.gameGraph, startNodeId, endNodeId);
  
  // Get next direction from path
  const nextDirection = getDirectionFromPath(path, ghost, cellSize);
  
  // If no path is found or we're at the destination, fall back to wall-following
  if (!nextDirection) {
    // Initialize wall following if needed
    if (!ghost.wallFollowing) {
      ghost.wallFollowing = true;
      ghost.wallFollowDir = Math.random() < 0.5 ? 'clockwise' : 'counterclockwise';
    }
    
    const directions = [
      { name: 'up', dx: 0, dy: -1 },
      { name: 'right', dx: 1, dy: 0 },
      { name: 'down', dx: 0, dy: 1 },
      { name: 'left', dx: -1, dy: 0 }
    ];
    
    const dirIndices = { 'up': 0, 'right': 1, 'down': 2, 'left': 3 };
    const lastDirIndex = dirIndices[ghost.direction] || 0;
    
    // Try directions in clockwise or counterclockwise order
    const order = ghost.wallFollowDir === 'clockwise' ? 
        [(lastDirIndex + 1) % 4, (lastDirIndex + 2) % 4, (lastDirIndex + 3) % 4, lastDirIndex] : 
        [(lastDirIndex + 3) % 4, (lastDirIndex + 2) % 4, (lastDirIndex + 1) % 4, lastDirIndex];
    
    for (const idx of order) {
      const dir = directions[idx];
      const newX = ghost.x + dir.dx * ghost.speed * 1;
      const newY = ghost.y + dir.dy * ghost.speed * 1;
      
      let blocked = false;
      const ghostAtNewPos = {
        x: newX, y: newY, width: ghost.width, height: ghost.height
      };
      
      // Check wall collisions
      for (const wall of walls) {
        if (checkCollision(ghostAtNewPos, wall)) {
          blocked = true;
          break;
        }
      }
      
      // Check boundaries
      if (isMobile()) {
        if (newX < 10 || newX + ghost.width > 540 || 
            newY < 10 || newY + ghost.height > 860) {
          blocked = true;
        }
      } else {
        if (newX < 20 || newX + ghost.width > 780 || 
            newY < 20 || newY + ghost.height > 480) {
          blocked = true;
        }
      }
      
      if (!blocked) {
        return directions[idx].name;
      }
    }
    
    return null;
  }
  
  // If we found a path with Dijkstra, exit wall-following mode
  ghost.wallFollowing = false;
  return nextDirection;
}

// Function to check if Pac-Man is in the top right corner (Easter Egg condition)
function isInTopRightCorner() {
  if (isMobile()) {
    // For mobile: define the top right corner area
    return pacman.x > 480 && pacman.y < 70;
  } else {
    // For desktop: define the top right corner area
    return pacman.x > 720 && pacman.y < 60;
  }
}

// Function to spawn the special ghost (Easter Egg)
function spawnSpecialGhost() {
  if (easterEggTriggered) return; // Only trigger once per game
  
  easterEggTriggered = true;
  
  // Create a "surprise" sound effect
  const surpriseSound = new Audio();
  surpriseSound.src = 'assets/surprise.mp3'; // Optional: add a sound effect
  try {
    surpriseSound.play().catch(e => console.log('Audio play prevented:', e));
  } catch (e) {
    console.log('Audio error:', e);
  }
  
  // Add new ghost to the ghosts array
  const specialGhost = {
    x: isMobile() ? 250 : 420, // Position in ghost house
    y: isMobile() ? 440 : 270, // Position in ghost house
    width: 28,
    height: 28,
    speed: 0.5, // Slightly faster than regular ghosts
    baseSpeed: 0.2,
    direction: 'up',
    lastShotTime: 0,
    isSpecial: true, // Flag to identify special ghost
    // For stability tracking
    lastDirection: null,
    directionTimer: 0,
    stuckCounter: 0
  };
  
  ghosts.push(specialGhost);
  
  // Show a small notification
  const notification = document.createElement('div');
  notification.style.position = "absolute";
  notification.style.top = "80px";
  notification.style.left = "50%";
  notification.style.transform = "translateX(-50%)";
  notification.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  notification.style.color = "#ff0000";
  notification.style.padding = "10px";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "1000";
  notification.style.fontFamily = "'Press Start 2P', monospace";
  notification.style.fontSize = "12px";
  notification.style.display = "flex";
  notification.style.alignItems = "center";
  notification.style.gap = "10px";
  
  // Add text content
  const textElement = document.createElement('div');
  textElement.textContent = "TANUKI Awakened! RUN!!!";
  
  // Add ghost image
  const ghostImage = document.createElement('img');
  ghostImage.src = specialGhostImg.src;
  ghostImage.style.width = "30px";
  ghostImage.style.height = "30px";
  ghostImage.style.imageRendering = "pixelated";
  
  // Add both elements to notification
  notification.appendChild(ghostImage);
  notification.appendChild(textElement);
  
  document.body.appendChild(notification);
  
  // Remove notification after a few seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// Function to spawn a new ghost at a valid location
function spawnNewGhost() {
  // Check if we've reached the maximum number of ghosts
  if (ghosts.length >= maxGhosts) {
    return;
  }

  // Increased speed for new ghosts based on current score
  // Each ghost is 15% faster than base speed, plus 5% per existing ghost
  const speedMultiplier = 1.15 + (0.05 * score);
  
  // Create ghost object
  const newGhost = {
    width: 28,
    height: 28,
    speed: 0.2 * speedMultiplier, // Speed increases with score
    baseSpeed: 0.2 * speedMultiplier, // Store original speed for resets
    direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)], // Random direction
    lastShotTime: 0,
    // For stability tracking
    lastDirection: null,
    directionTimer: 0,
    stuckCounter: 0
  };
  
  // Find a valid position for the ghost
  let validPosition = false;
  let attempts = 0;
  const maxAttempts = 50;
  
  while (!validPosition && attempts < maxAttempts) {
    attempts++;
    
    // Different spawn positions based on device
    if (isMobile()) {
      // For mobile, try to spawn in various areas of the maze
      const spawnAreas = [
        { x: 50, y: 50, width: 100, height: 100 }, // Top left
        { x: 400, y: 50, width: 100, height: 100 }, // Top right
        { x: 50, y: 700, width: 100, height: 100 }, // Bottom left
        { x: 400, y: 700, width: 100, height: 100 }, // Bottom right
        { x: 250, y: 440, width: 50, height: 30 }   // Ghost house
      ];
      
      // Select a random spawn area
      const spawnArea = spawnAreas[Math.floor(Math.random() * spawnAreas.length)];
      
      // Generate random coordinates within the spawn area
      newGhost.x = spawnArea.x + Math.floor(Math.random() * spawnArea.width);
      newGhost.y = spawnArea.y + Math.floor(Math.random() * spawnArea.height);
    } else {
      // For desktop, use similar approach with appropriate coordinates
      const spawnAreas = [
        { x: 50, y: 50, width: 100, height: 50 },    // Top left
        { x: 650, y: 50, width: 100, height: 50 },   // Top right
        { x: 50, y: 400, width: 100, height: 50 },   // Bottom left
        { x: 650, y: 400, width: 100, height: 50 },  // Bottom right
        { x: 350, y: 260, width: 100, height: 30 }   // Ghost house
      ];
      
      // Select a random spawn area
      const spawnArea = spawnAreas[Math.floor(Math.random() * spawnAreas.length)];
      
      // Generate random coordinates within the spawn area
      newGhost.x = spawnArea.x + Math.floor(Math.random() * spawnArea.width);
      newGhost.y = spawnArea.y + Math.floor(Math.random() * spawnArea.height);
    }
    
    // Check for collisions with walls
    validPosition = true;
    for (const wall of walls) {
      if (checkCollision(newGhost, wall)) {
        validPosition = false;
        break;
      }
    }
    
    // Check for collisions with other ghosts
    if (validPosition) {
      for (const ghost of ghosts) {
        if (checkCollision(newGhost, ghost)) {
          validPosition = false;
          break;
        }
      }
    }
  }
  
  // If couldn't find valid position after several attempts, use ghost house
  if (!validPosition) {
    if (isMobile()) {
      newGhost.x = 250;
      newGhost.y = 440;
    } else {
      newGhost.x = 400;
      newGhost.y = 260;
    }
  }
  
  // Randomly choose a ghost color/type
  const ghostTypes = [
    { color: '#FF0000', img: ghostImg }, // Red ghost (default)
    { color: '#00FFFF', img: ghostImg }, // Cyan ghost
    { color: '#FFC0CB', img: ghostImg }, // Pink ghost
    { color: '#FFA500', img: ghostImg }  // Orange ghost
  ];
  
  const ghostType = ghostTypes[Math.floor(Math.random() * ghostTypes.length)];
  newGhost.color = ghostType.color;
  
  // Add the new ghost to the array
  ghosts.push(newGhost);
  
  // Show a brief notification that a new ghost has appeared
  const notification = document.createElement('div');
  notification.style.position = 'absolute';
  notification.style.top = '80px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  notification.style.color = ghostType.color;
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  notification.style.fontFamily = "'Press Start 2P', monospace";
  notification.style.fontSize = '12px';
  notification.innerHTML = 'New EMMA Appeared!';
  
  document.body.appendChild(notification);
  
  // Remove notification after a short time
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 1500);
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

// Function to reset positions of pacman and ghosts
function resetPositions() {
  lastPositionReset = Date.now();
  
  if (isMobile()) {
    // Mobile starting positions - adjusted for taller maze
    pacman.x = 80; 
    pacman.y = 820; // Lower position for taller maze
    
    // Reset ghosts for mobile layout
    ghosts[0].x = 220; 
    ghosts[0].y = 440; // Inside ghost house but not on a wall
    ghosts[1].x = 280; // Fixed position so it's not stuck
    ghosts[1].y = 440; // Clear of any walls so it can move
  } else {
    // Desktop starting positions
    pacman.x = 50;
    pacman.y = 450;
    
    // Reset ghosts for desktop layout
    ghosts[0].x = 360;
    ghosts[0].y = 260;
    ghosts[1].x = 380;
    ghosts[1].y = 260;
  }
  
  // Clear fireballs when positions reset
  ghostFireballs = [];
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

// Ghost shooting fireballs
function ghostShoot(ghost) {
  // Don't allow shooting if ghost can't shoot yet
  if (!ghostsCanShoot) return;
  
  // Don't allow shooting too frequently (3 second cooldown)
  const now = Date.now();
  if (now - ghost.lastShotTime < 3000) return;
  
  // Determine direction based on ghost movement
  const distX = pacman.x - ghost.x;
  const distY = pacman.y - ghost.y;
  
  // Shoot in the direction with the greatest distance to pacman
  let direction;
  if (Math.abs(distX) > Math.abs(distY)) {
    direction = distX > 0 ? 'right' : 'left';
  } else {
    direction = distY > 0 ? 'down' : 'up';
  }

  // Create a new fireball
  const fireball = {
    x: ghost.x + ghost.width / 2 - 8, // Center of ghost minus half of fireball width
    y: ghost.y + ghost.height / 2 - 8, // Center of ghost minus half of fireball height
    width: 16,
    height: 16,
    speed: 4,
    direction: direction
  };

  // Add the fireball to the array
  ghostFireballs.push(fireball);
  
  // Update last shot time
  ghost.lastShotTime = now;
}

// Update fireballs position and check collisions
function updateFireballs() {
  for (let i = ghostFireballs.length - 1; i >= 0; i--) {
    const fireball = ghostFireballs[i];
    
    // Move fireball according to direction
    switch (fireball.direction) {
      case 'up':
        fireball.y -= fireball.speed;
        break;
      case 'down':
        fireball.y += fireball.speed;
        break;
      case 'left':
        fireball.x -= fireball.speed;
        break;
      case 'right':
        fireball.x += fireball.speed;
        break;
    }
    
    // Check collision with Pacman
    if (checkCollision(fireball, pacman)) {
      ghostFireballs.splice(i, 1); // Remove fireball
      if (lives > 1) {
        showGotYouPopup(); // Show popup instead of directly calling loseLife
      } else {
        loseLife(); // Go straight to game over if it's the last life
      }
      return; // Exit the function to prevent further processing
    }
    
    // Check collision with walls
    let hitWall = false;
    for (const wall of walls) {
      if (checkCollision(fireball, wall)) {
        hitWall = true;
        break;
      }
    }
    
    // Also check boundaries
    if (isMobile()) {
      if (fireball.x < 10 || fireball.x + fireball.width > 540 || 
          fireball.y < 10 || fireball.y + fireball.height > 860) {
        hitWall = true;
      }
    } else {
      if (fireball.x < 20 || fireball.x + fireball.width > 780 || 
          fireball.y < 20 || fireball.y + fireball.height > 480) {
        hitWall = true;
      }
    }
    
    // Remove fireball if it hit a wall
    if (hitWall) {
      ghostFireballs.splice(i, 1);
    }
  }
}

function updateGhosts() {
  for (const ghost of ghosts) {
    const prevX = ghost.x;
    const prevY = ghost.y;
    
    // Initialize direction stability tracking if it doesn't exist
    if (ghost.lastDirection === undefined) {
      ghost.lastDirection = null;
      ghost.directionTimer = 0;
      ghost.stuckCounter = 0;
    }
    
    // Find best direction to move using Dijkstra's algorithm
    const bestDirection = findBestDirection(ghost, pacman.x, pacman.y);
    
    // Add directional stability to prevent vibration
    // Only change direction after a minimum time has passed
    const now = Date.now();
    if (bestDirection !== ghost.lastDirection) {
      // If we've been in the current direction for less than the threshold
      if (ghost.directionTimer > 0 && now - ghost.directionTimer < 250) {
        // Continue in the same direction to prevent vibration
        // unless we're completely stuck
        if (ghost.stuckCounter < 5) {
          // Continue with last direction
          const dirToUse = ghost.lastDirection;
          if (dirToUse) {
            switch (dirToUse) {
              case 'up':
                ghost.y -= ghost.speed;
                break;
              case 'down':
                ghost.y += ghost.speed;
                break;
              case 'left':
                ghost.x -= ghost.speed;
                break;
              case 'right':
                ghost.x += ghost.speed;
                break;
            }
          }
        } else {
          // We've been stuck too long, accept the direction change
          ghost.lastDirection = bestDirection;
          ghost.directionTimer = now;
          ghost.stuckCounter = 0;
        }
      } else {
        // Enough time has passed, allow direction change
        ghost.lastDirection = bestDirection;
        ghost.directionTimer = now;
        ghost.stuckCounter = 0;
      }
    }
    
    // If we have a direction to move in, try to move
    const directionToUse = ghost.lastDirection || bestDirection;
    if (directionToUse) {
      const originalX = ghost.x;
      const originalY = ghost.y;
      
      // Apply movement based on the chosen direction
      switch (directionToUse) {
        case 'up':
          ghost.y -= ghost.speed;
          break;
        case 'down':
          ghost.y += ghost.speed;
          break;
        case 'left':
          ghost.x -= ghost.speed;
          break;
        case 'right':
          ghost.x += ghost.speed;
          break;
      }
      
      // Check for collisions after moving
      let hitWall = false;
      for (const wall of walls) {
        if (checkCollision(ghost, wall)) {
          hitWall = true;
          break;
        }
      }
      
      // Check boundaries too
      if (isMobile()) {
        if (ghost.x < 10 || ghost.x + ghost.width > 540 || 
            ghost.y < 10 || ghost.y + ghost.height > 860) {
          hitWall = true;
        }
      } else {
        if (ghost.x < 20 || ghost.x + ghost.width > 780 || 
            ghost.y < 20 || ghost.y + ghost.height > 480) {
          hitWall = true;
        }
      }
      
      // If we hit a wall, revert position
      if (hitWall) {
        ghost.x = prevX;
        ghost.y = prevY;
      }
      
      // If we didn't move at all, we might be stuck
      if (ghost.x === originalX && ghost.y === originalY) {
        ghost.stuckCounter++;
      } else {
        ghost.stuckCounter = 0; // Reset stuck counter if we moved
      }
    }
    
    // If ghost is completely stuck (didn't move for several frames), try random movement as fallback
    if (ghost.stuckCounter >= 10) {
      const directions = ['up', 'down', 'left', 'right'];
      // Try to avoid choosing the same direction
      const filteredDirs = directions.filter(d => d !== ghost.lastDirection);
      const randomDir = filteredDirs[Math.floor(Math.random() * filteredDirs.length)] || directions[Math.floor(Math.random() * directions.length)];
      
      // Try moving in the random direction
      const originalX = ghost.x;
      const originalY = ghost.y;
      
      switch (randomDir) {
        case 'up':
          ghost.y -= ghost.speed * 1;
          break;
        case 'down':
          ghost.y += ghost.speed * 1;
          break;
        case 'left':
          ghost.x -= ghost.speed * 1;
          break;
        case 'right':
          ghost.x += ghost.speed * 1;
          break;
      }
      
      // Check if the random movement hit a wall
      let randomHitWall = false;
      for (const wall of walls) {
        if (checkCollision(ghost, wall)) {
          randomHitWall = true;
          break;
        }
      }
      
      // Check boundaries for random movement too
      if (isMobile()) {
        if (ghost.x < 10 || ghost.x + ghost.width > 540 || 
            ghost.y < 10 || ghost.y + ghost.height > 860) {
          randomHitWall = true;
        }
      } else {
        if (ghost.x < 20 || ghost.x + ghost.width > 780 || 
            ghost.y < 20 || ghost.y + ghost.height > 480) {
          randomHitWall = true;
        }
      }
      
      // If random movement hit a wall, revert position
      if (randomHitWall) {
        ghost.x = originalX;
        ghost.y = originalY;
      } else {
        // Random movement worked, use this as the new direction
        ghost.lastDirection = randomDir;
        ghost.directionTimer = Date.now();
        ghost.stuckCounter = 0;
      }
    }
    
    // Randomly decide to shoot (if enabled)
    if (ghostsCanShoot && Math.random() < 0.005) { // 0.5% chance per frame
      ghostShoot(ghost);
    }
  }
}

// Function to handle losing a life
function loseLife() {
  // Prevent multiple life losses at once by checking if positions were just reset
  const now = Date.now();
  if (now - lastPositionReset < 1000) return;
  
  lives--;
  
  if (lives <= 0) {
    gameOver();
  } else {
    resetPositions();
  }
}

// Creates and shows a popup when pacman is caught
function showGotYouPopup() {
  // Check if popup already exists
  if (document.getElementById('gotYouPopup')) {
    return;
  }
  
  // Create popup element
  const popup = document.createElement('div');
  popup.id = 'gotYouPopup';
  popup.className = 'game-popup';
  popup.style.display = 'flex';
  popup.style.zIndex = '1001'; // Make sure it's above other popups
  
  // Calculate remaining lives (subtract 1 because we haven't called loseLife yet)
  const remainingLives = lives - 1;
  
  // Create popup content
  const content = document.createElement('div');
  content.className = 'popup-content';
  content.innerHTML = `
    <h2>I got uuu!</h2>
    <p>Only ${remainingLives} ${remainingLives === 1 ? 'life' : 'lives'} left!</p>
    <img src="assets/gotyou.png" alt="Got You!" style="max-width: 150px; margin: 10px auto; display: block;">
    <button id="continueBtn" class="arcade-button">CONTINUE</button>
  `;
  
  // Add content to popup
  popup.appendChild(content);
  
  // Add popup to body
  document.body.appendChild(popup);
  
  // Add event listener to continue button
  document.getElementById('continueBtn').addEventListener('click', function() {
    closeGotYouPopup();
    loseLife(); // Call loseLife after closing the popup
  });
  
  // Pause the game while popup is showing
  gameRunning = false;
}

// Function to close the popup
function closeGotYouPopup() {
  const popup = document.getElementById('gotYouPopup');
  if (popup) {
    document.body.removeChild(popup);
    if (lives > 0) {
      gameRunning = true; // Resume the game if still have lives
      requestAnimationFrame(gameLoop);
    }
  }
}

/********************
* MAIN GAME LOGIC
********************/

function updateGame() {
  // Check for Easter Egg condition
  if (!easterEggTriggered && isInTopRightCorner()) {
    spawnSpecialGhost();
  }
  
  // Update ghosts
  updateGhosts();
  
  // Update fireballs
  updateFireballs();

  // Check if Pac-Man eats pellet
  if (checkCollision(pacman, pellet)) {
    score++;
    
    // Spawn a new ghost when pellet is eaten
    spawnNewGhost();
    
    // Increase ghost speed by 10% for each pellet eaten
    for (const ghost of ghosts) {
      ghost.speed = ghost.baseSpeed * (1 + (score * 0.1)); // 10% cumulative increase
    }
    
    // Enable ghost shooting after 2 pellets
    if (score >= 2) {
      ghostsCanShoot = true;
    }
    
    placePelletSafely();
    if (score >= winScore) {
      endGame();
      return;
    }
  }

  // Check if any ghost catches Pac-Man
  for (const ghost of ghosts) {
    if (checkCollision(pacman, ghost)) {
      if (lives > 1) {
        showGotYouPopup(); // Show popup instead of directly calling loseLife
      } else {
        loseLife(); // Go straight to game over if it's the last life
      }
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

  // Draw fireballs
  for (const fireball of ghostFireballs) {
    if (fireballImg.complete) {
      ctx.drawImage(fireballImg, fireball.x, fireball.y, fireball.width, fireball.height);
    } else {
      // Fallback: orange circle
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.arc(fireball.x + fireball.width / 2, fireball.y + fireball.height / 2, fireball.width / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw ghosts - modified to remove background color
  for (const ghost of ghosts) {
    if (ghost.isSpecial) {
      // Draw special ghost with different image
      if (specialGhostImg.complete) {
        ctx.drawImage(specialGhostImg, ghost.x, ghost.y, ghost.width, ghost.height);
      } else {
        // Fallback: pink square for special ghost
        ctx.fillStyle = 'magenta';
        ctx.fillRect(ghost.x, ghost.y, ghost.width, ghost.height);
      }
    } else {
      // Draw regular ghost without color tint
      if (ghostImg.complete) {
        // Draw ghost image directly without color overlay
        ctx.drawImage(ghostImg, ghost.x, ghost.y, ghost.width, ghost.height);
      } else {
        // Fallback: red square
        ctx.fillStyle = 'red';
        ctx.fillRect(ghost.x, ghost.y, ghost.width, ghost.height);
      }
    }
  }

  // Draw score in a retro yellow
  ctx.fillStyle = 'yellow';
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.fillText(`Score: ${score}`, 30, 40);
  
  // Draw lives as hearts/rings in top right
  const heartSize = 30;
  const startX = isMobile() ? 500 : 750;
  const startY = 40;
  
  for (let i = 0; i < lives; i++) {
    if (heartImg.complete) {
      ctx.drawImage(heartImg, startX - (i * (heartSize + 10)), startY - heartSize/2, heartSize, heartSize);
    } else {
      // Fallback: red heart shape
      ctx.fillStyle = 'red';
      const x = startX - (i * (heartSize + 10));
      const y = startY - heartSize/2;
      
      ctx.beginPath();
      ctx.moveTo(x + heartSize/2, y + heartSize/4);
      ctx.bezierCurveTo(x + heartSize/2, y, x, y, x, y + heartSize/4);
      ctx.bezierCurveTo(x, y + heartSize/2, x + heartSize/2, y + heartSize, x + heartSize/2, y + heartSize);
      ctx.bezierCurveTo(x + heartSize/2, y + heartSize, x + heartSize, y + heartSize/2, x + heartSize, y + heartSize/4);
      ctx.bezierCurveTo(x + heartSize, y, x + heartSize/2, y, x + heartSize/2, y + heartSize/4);
      ctx.fill();
    }
  }
}

function gameLoop() {
  if (!gameRunning) return;
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  score = 0;
  lives = 3;
  ghostsCanShoot = false;
  easterEggTriggered = false; // Reset easter egg on game start
  
  // Reset ghosts array to initial state (just 2 ghosts)
  ghosts.length = 0; // Clear array
  
  // Add initial ghosts
  ghosts.push({
    x: isMobile() ? 220 : 360, 
    y: isMobile() ? 440 : 240,
    width: 28,
    height: 28,
    speed: 0.2,
    baseSpeed: 0.2,
    direction: 'right',
    lastShotTime: 0,
    color: '#FF0000' // Red ghost
  });
  
  ghosts.push({
    x: isMobile() ? 280 : 440,
    y: isMobile() ? 440 : 240,
    width: 28,
    height: 28,
    speed: 0.2,
    baseSpeed: 0.2,
    direction: 'left', 
    lastShotTime: 0,
    color: '#00FFFF' // Cyan ghost
  });
  
  resetPositions();
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

// ***** Add Swipe Controls for Mobile *****
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const minSwipeDistance = 30; // Minimum distance for a swipe to register
let currentSwipeDirection = null;
let swipeMoveInterval = null;

// Add touch event listeners to the canvas for swipe detection
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

// Handle touch start - record initial touch position
function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

// Handle touch move - update current touch position
function handleTouchMove(e) {
  e.preventDefault();
  if (!e.touches.length) return;
  const touch = e.touches[0];
  touchEndX = touch.clientX;
  touchEndY = touch.clientY;
  
  // Calculate swipe direction
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  
  // Only process if we've moved enough distance
  if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
    // Determine primary direction (horizontal or vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      const direction = deltaX > 0 ? 'right' : 'left';
      if (direction !== currentSwipeDirection) {
        stopSwipeMoving();
        currentSwipeDirection = direction;
        startSwipeMoving(direction);
      }
    } else {
      // Vertical swipe
      const direction = deltaY > 0 ? 'down' : 'up';
      if (direction !== currentSwipeDirection) {
        stopSwipeMoving();
        currentSwipeDirection = direction;
        startSwipeMoving(direction);
      }
    }
  }
}

// Handle touch end - stop movement when touch is released
function handleTouchEnd(e) {
  e.preventDefault();
  stopSwipeMoving();
  currentSwipeDirection = null;
}

// Start continuous movement in the swiped direction
function startSwipeMoving(direction) {
  if (!swipeMoveInterval) {
    // Move immediately once
    movePacman(direction);
    
    // Then set up continuous movement
    swipeMoveInterval = setInterval(() => {
      movePacman(direction);
    }, 100);
  }
}

// Stop continuous movement
function stopSwipeMoving() {
  clearInterval(swipeMoveInterval);
  swipeMoveInterval = null;
}

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
