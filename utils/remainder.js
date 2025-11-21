const twilio = require('twilio');
const cron = require('node-cron');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const toNumber = 'whatsapp:+YOUR_NUMBER'; // replace with your personal WhatsApp number

// Send a test reminder every minute
cron.schedule('* * * * *', () => {
  client.messages.create({
    body: 'This is a test reminder from Smriti AI!',
    from: fromNumber,
    to: toNumber,
  })
  .then(message => console.log('Message sent:', message.sid))
  .catch(err => console.error(err));
});

console.log('WhatsApp reminder service running...');
