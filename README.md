# Brendon Rims Game

## Running the application locally

1. Make sure you have Node.js installed on your system
2. Open a terminal and navigate to the project directory:
   ```
   cd /Users/fferrari/Work/brendonrims
   ```
3. Install the required dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npm start
   ```
   (This runs the `node server.js` command defined in package.json)
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Development

The application is a Node.js Express server that serves static files from the `public` directory. The game logic is in `public/game.js`.

## Environment Variables

Environment variables are loaded from the `.env` file. Make sure this file exists with the required variables before running the application.
