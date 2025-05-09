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
    const username = req.body.username || 'Anonymous Player';
    const personalizedMessage = `${username}: ${smsMessage}`;

    console.log('Sending SMS:', personalizedMessage);
    
    // Get all target phone numbers
    const targetNumbers = [
      process.env.TARGET_NUMBER,
      process.env.TARGET_NUMBER2,
      process.env.TARGET_NUMBER3
    ].filter(Boolean); // Filter out any undefined numbers
    
    console.log('To:', targetNumbers);
    console.log('From:', process.env.TEXTBELT_KEY);
    
    try {
      // Send SMS to all numbers in parallel
      const sendPromises = targetNumbers.map(async (phoneNumber) => {
        const params = new URLSearchParams({
          phone: phoneNumber,
          message: personalizedMessage,
          key: process.env.TEXTBELT_KEY || 'textbelt'
        });
        
        const response = await fetch('https://textbelt.com/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        });
        
        const data = await response.json();
        return {
          number: phoneNumber,
          success: data.success,
          details: data
        };
      });
      
      const results = await Promise.all(sendPromises);
      
      // Check if at least one message was sent successfully
      const anySuccess = results.some(result => result.success);
      
      if (anySuccess) {
        console.log('SMS sent successfully to at least one recipient:', results);
        res.json({ success: true, results });
      } else {
        console.error('Error sending all SMS messages:', results);
        res.status(500).json({ error: 'Failed to send messages', results });
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
