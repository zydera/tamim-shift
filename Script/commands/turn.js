// turn.js

const fs = require('fs');
const path = require('path');

const statusFilePath = path.join(__dirname, '../../data/botStatus.json');

// Ensure the status file exists
data = {}; // default data structure
if (!fs.existsSync(statusFilePath)) {
    fs.writeFileSync(statusFilePath, JSON.stringify(data, null, 2));
}

function getStatus(groupId) {
    const data = JSON.parse(fs.readFileSync(statusFilePath));
    return data[groupId] || 'on'; // default to 'on' if not found
}

function setStatus(groupId, status) {
    const data = JSON.parse(fs.readFileSync(statusFilePath));
    data[groupId] = status;
    fs.writeFileSync(statusFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: 'turn',
    description: 'Turn the bot on/off for a specific group',
    async execute(message, args) {
        const groupId = message.guild.id;
        const isAdmin = message.member.hasPermission('ADMINISTRATOR');
        const isOwner = message.author.id === 'YOUR_BOT_OWNER_ID'; // Replace with actual bot owner ID

        if (!isAdmin && !isOwner) {
            return message.reply('You do not have the permission to use this command.');
        }

        const action = args[0]?.toLowerCase();
        const currentStatus = getStatus(groupId);

        if (action === 'off') {
            setStatus(groupId, 'off');
            return message.channel.send('Bot is now turned off for this group.');
        } else if (action === 'on') {
            setStatus(groupId, 'on');
            return message.channel.send('Bot is now turned on for this group.');
        } else {
            return message.channel.send(`Current status is: **${currentStatus}**. Use '.turn on' or '.turn off' to change.`);
        }
    }
};