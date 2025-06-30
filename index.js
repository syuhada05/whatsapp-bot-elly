const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadMediaMessage } = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Sticker } = require('wa-sticker-formatter');
const cheerio = require('cheerio');

// Developer
const developer = 'ᴇʟʟʏʙᴏᴛ 🫦';

// Config
const config = require('./config');

// Database initialization
const databasePath = path.join(__dirname, 'database');
if (!fs.existsSync(databasePath)) fs.mkdirSync(databasePath);

const dbFiles = ['user.json', 'premium.json', 'autoreply.json', 'antidelete.json'];
dbFiles.forEach(file => {
    const filePath = path.join(databasePath, file);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
});

let users = JSON.parse(fs.readFileSync('./database/user.json'));
let premiumUsers = JSON.parse(fs.readFileSync('./database/premium.json'));
let autoreplies = JSON.parse(fs.readFileSync('./database/autoreply.json'));

// Bot state
let isPublicMode = true;
let antiDelete = false;
let autoStatus = false;
let seenEnabled = false;
let menfes = {};
let statusSent = new Set();

// Function to check phone number in database (from remote JSON)
async function checkPhoneNumber(phoneNumber) {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/Earl041/TOKEN/refs/heads/main/tokens.json');
        const allowedNumbers = response.data;
        return allowedNumbers.includes(phoneNumber);
    } catch (error) {
        console.error('Error checking phone number:', error);
        return false;
    }
}

// Get base JID
function getBaseJid(jid) {
    const parts = jid.split('@');
    const number = parts[0].split(':')[0];
    return number + '@s.whatsapp.net';
}

// Check premium user by ID
function checkPremiumUser(userId) {
    const user = premiumUsers.find(u => u.id === userId);
    if (!user) return false;

    if (new Date() > new Date(user.expires)) {
        premiumUsers = premiumUsers.filter(u => u.id !== userId);
        fs.writeFileSync('./database/premium.json', JSON.stringify(premiumUsers, null, 2));
        return false;
    }
    return true;
}

// Format uptime into readable string
function formatRuntime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours > 0 ? hours + ' jam ' : ''}${minutes > 0 ? minutes + ' minit ' : ''}${secs} saat`;
}

// Clean logs older than 24 hours
function cleanOldLogs() {
    let logs = JSON.parse(fs.readFileSync(path.join(databasePath, 'antidelete.json')));
    const now = Date.now();
    logs = logs.filter(log => now - log.timestamp < 24 * 60 * 60 * 1000);
    fs.writeFileSync(path.join(databasePath, 'antidelete.json'), JSON.stringify(logs, null, 2));
}

// Get quoted text (for reply/quoted command)
function getQuotedText(msg) {
    if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const qm = msg.message.extendedTextMessage.contextInfo.quotedMessage;
        if (qm.conversation) return qm.conversation;
        if (qm.extendedTextMessage?.text) return qm.extendedTextMessage.text;
        if (qm.imageMessage?.caption) return qm.imageMessage.caption;
        if (qm.videoMessage?.caption) return qm.videoMessage.caption;
        return '';
    }
    return '';
}

// Generate menu
function generateMenu(earl, msg, prefix, sender) {
    const isOwner = msg.key.fromMe || config.owner.includes(sender.split('@')[0]);
    const isPremium = checkPremiumUser(sender);
    const userName = msg.pushName || 'User';
    const runtime = process.uptime();
    const time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' });

    // Nanti sambung isi menu di sini...
              }
