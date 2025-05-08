require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
// Make sure you have installed node-fetch by running `npm install node-fetch` in your project root
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Load environment variables (make sure you have a .env file or set these in your environment)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const targetNumber = process.env.TARGET_NUMBER;

const client = twilio(accountSid, authToken);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static('public'));

// Endpoint to send SMS when a player wins
app.post('/win', async (req, res) => {
    const smsMessage = req.body.message || 'Player just won the game! Congratulations!';
    console.log('Sending SMS:', smsMessage);
    console.log('To:', process.env.TARGET_NUMBER);
    console.log('From:', process.env.TEXTBELT_KEY );
    // Prepare POST data for Textbelt
    const params = new URLSearchParams({
      phone: process.env.TARGET_NUMBER,           // Set in your .env file (e.g., +15551234567)
      message: smsMessage,
      key: process.env.TEXTBELT_KEY || 'textbelt'   // Free key is 'textbelt'
    });
    
    try {
      const response = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('SMS sent successfully:', data);
        res.json({ success: true });
      } else {
        console.error('Error sending SMS:', data);
        res.status(500).json({ error: data.error });
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      res.status(500).json({ error: error.message });
    }
  });
  


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
