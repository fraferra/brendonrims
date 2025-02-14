const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Twilio configuration (ensure you set these environment variables)
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const targetNumber = process.env.TARGET_NUMBER; // The fixed number to receive the SMS

const client = require('twilio')(accountSid, authToken);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to send SMS when player wins
app.post('/win', (req, res) => {
  client.messages
    .create({
      body: "Congratulations! A player has just won the game!",
      from: twilioNumber,
      to: targetNumber
    })
    .then(message => {
      console.log(`SMS sent with SID: ${message.sid}`);
      res.json({ success: true });
    })
    .catch(error => {
      console.error("SMS sending failed:", error);
      res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
