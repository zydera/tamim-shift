const axios = require("axios");

// Allowed suffixes mapped in order (Up to GG / Googol)
const SUFFIXES = [
  "", "K", "M", "B", "T", "QA", "QI", "SX", "SP", "OC", "NO", "D", 
  "UD", "DD", "TD", "QAD", "QID", "SXD", "SPD", "OCD", "NOD", "VG", 
  "UVG", "DVG", "TVG", "QAVG", "QIVG", "SXVG", "SPVG", "OCVG", "NOVG", 
  "TG", "UTG", "DTG", "GG"
];

const SUFFIX_FORMATTED = [
  "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "D", 
  "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "Vg", 
  "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg", 
  "Tg", "Utg", "Dtg", "GG"
];

// Smart Math & Validation Engine
const validateAndNormalize = (amountStr, multiplier = 1) => {
  const cleanStr = String(amountStr).replace(/,/g, '').trim();
  const match = cleanStr.match(/^([0-9.]+)([a-zA-Z]*)$/);
  
  if (!match) return { valid: false };
  
  let num = parseFloat(match[1]);
  let suffix = match[2].toUpperCase();
  
  let index = SUFFIXES.indexOf(suffix);
  if (index === -1) return { valid: false }; 
  
  num *= multiplier;
  
  while (num >= 1000 && index < SUFFIXES.length - 1) {
    num /= 1000;
    index++;
  }
  
  while (num > 0 && num < 1 && index > 0) {
    num *= 1000;
    index--;
  }
  
  num = Number(num.toFixed(2));
  
  return { 
    valid: true, 
    formatted: `${num}${SUFFIX_FORMATTED[index]}` 
  };
};

// Helper to convert numbers to bold unicode
const toBoldNum = (num) => {
  const map = {'0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗'};
  return String(num).replace(/[0-9]/g, m => map[m] || m);
};

// Dice face mapper
const getDiceFace = (num) => {
  const faces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  return faces[num];
};

// Random number between min and max (inclusive)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports.config = {
  name: "dice",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Play against the bot in a dice roll",
  commandCategory: "economy",
  usages: "[amount]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const rawBet = args[0];
    if (!rawBet) return api.sendMessage("⚠️ | 𝐄𝐧𝐭𝐞𝐫 𝐛𝐞𝐭 𝐚𝐦𝐨𝐮𝐧𝐭.", event.threadID, event.messageID);

    // Validate and format the user's bet
    const betInfo = validateAndNormalize(rawBet, 1);
    if (!betInfo.valid) {
      return api.sendMessage("⚠️ | 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭 𝐭𝐲𝐩𝐞! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐮𝐬𝐞 𝐯𝐚𝐥𝐢𝐝 𝐬𝐮𝐟𝐟𝐢𝐱𝐞𝐬 (𝐞.𝐠., 𝐊, 𝐌, 𝐁).", event.threadID, event.messageID);
    }

    const bet = betInfo.formatted; 
    const uid = event.senderID;
    
    // Step 1: Deduct the bet FIRST
    const deductUrl = `https://mahimcraft.alwaysdata.net/economy/?type=deduct&uid=${uid}&quantity=${bet}&notes=Dice+Bet`;
    const deductRes = await axios.get(deductUrl);
    
    if (deductRes.data.status !== "success") {
      return api.sendMessage(`⚠️ | ${deductRes.data.message}`, event.threadID, event.messageID);
    }

    // Step 2: STRICT 50% Win Chance
    const isWin = Math.random() < 0.5; 
    
    let playerRoll, botRoll;

    if (isWin) {
      // Player gets high (4-6), Bot gets low (1-3)
      playerRoll = randomInt(4, 6);
      botRoll = randomInt(1, 3);
    } else {
      // Player gets low (1-3), Bot gets high (4-6)
      playerRoll = randomInt(1, 3);
      botRoll = randomInt(4, 6);
    }

    // Step 3: Smart Winnings Payout
    let profitMultiplier = 1; // 1X Profit on a standard dice win
    
    if (isWin) {
      // If profit is 1X, we add 2X the bet to the API (1X refunds the deduction + 1X pure profit)
      const totalPayoutMultiplier = profitMultiplier + 1; 
      const payoutAmount = validateAndNormalize(bet, totalPayoutMultiplier).formatted;
      
      const addUrl = `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${payoutAmount}&notes=Dice+Win`;
      
      // DELAY 2 seconds to ensure database writes safely
      await new Promise(resolve => setTimeout(resolve, 2000));
      const addRes = await axios.get(addUrl);
      
      if (addRes.data.status !== "success") {
        return api.sendMessage(`⚠️ | 𝐄𝐫𝐫𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐰𝐢𝐧𝐧𝐢𝐧𝐠𝐬: ${addRes.data.message}`, event.threadID, event.messageID);
      }
    }

    // Step 4: Formatting the NARROW mobile-friendly output
    const profitAmountStr = validateAndNormalize(bet, profitMultiplier).formatted;
    const playerFace = getDiceFace(playerRoll);
    const botFace = getDiceFace(botRoll);

    let msg = `🎲 𝐃𝐈𝐂𝐄 𝐑𝐎𝐋𝐋 🎲\n`;
    msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += ` 👤 𝐘𝐨𝐮: ${playerFace} [${toBoldNum(playerRoll)}]\n`;
    msg += ` 🤖 𝐁𝐨𝐭: ${botFace} [${toBoldNum(botRoll)}]\n`;
    msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    
    if (isWin) {
      msg += `✅ 𝐘𝐎𝐔 𝐖𝐎𝐍!\n➕ 💲${profitAmountStr}`;
    } else {
      msg += `📛 𝐘𝐎𝐔 𝐋𝐎𝐒𝐓!\n➖ 💲${bet}`;
    }

    return api.sendMessage(msg, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝.", event.threadID, event.messageID);
  }
};
