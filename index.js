
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('Scan the QR code above with WhatsApp to authenticate.');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

app.use(express.json());

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    if (!number || !message) {
        return res.status(400).send('Number and message are required.');
    }

    try {
        const chatId = `${number}@c.us`; // WhatsApp format for numbers
        await client.sendMessage(chatId, message);
        return res.status(200).send('Message sent successfully!');
    } catch (error) {
        return res.status(500).send('Failed to send message: ' + error.message);
    }
});

app.listen(3000, () => {
    console.log('API is running on port 3000.');
});
