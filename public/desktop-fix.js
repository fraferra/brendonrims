/**
 * Desktop view fix for the game canvas
 * Include this script in the HTML after game.js for temporary debugging
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!isMobile()) {
    // Override the desktop-specific part of scaleCanvas function
    const originalScaleCanvas = window.scaleCanvas;
    
    window.scaleCanvas = function() {
      if (!isMobile()) {
        const canvas = document.getElementById('gameCanvas');
        // Adjust canvas size to fit viewport
        const container = document.getElementById('gameContainer');
        
        // Reset any previous styling
        canvas.style.position = 'relative';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.marginLeft = '0';
        canvas.style.marginTop = '0';
        canvas.style.transform = '';
        
        // Calculate appropriate scale
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const originalWidth = 800;
        const originalHeight = 520;
        
        const scaleX = (containerWidth * 0.9) / originalWidth;
        const scaleY = (containerHeight * 0.85) / originalHeight;
        const scale = 1;//Math.min(scaleX, scaleY);
        
        // Apply scale
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = 'center top';
        canvas.style.margin = '0 auto';
        
        // Log debug info
        console.log('Desktop view fixed. Scale:', scale);
      } else {
        // Use original mobile scaling
        originalScaleCanvas();
      }
    };
    
    // Call the new function
    window.scaleCanvas();
  }
});

// Add this to HTML for quick testing
console.log('Desktop fix script loaded');
