require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

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
app.post('/win', (req, res) => {
  const smsMessage = req.body.message || 'Player just won the game! Congratulations!';

  client.messages
    .create({
      body: smsMessage,
      from: twilioNumber,
      to: targetNumber
    })
    .then(message => {
      console.log('SMS sent, SID:', message.sid);
      res.json({ success: true, sid: message.sid });
    })
    .catch(error => {
      console.error('Error sending SMS:', error);
      res.status(500).json({ error: error.message });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
