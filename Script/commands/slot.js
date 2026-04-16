const axios = require("axios");

// Helper function to shuffle an array
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

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
  if (index === -1) return { valid: false }; // Blocks invalid types like "100bm"
  
  // Multiply the base number
  num *= multiplier;
  
  // Normalize upwards (e.g., 1000M -> 1B or 1000Dtg -> 1GG)
  while (num >= 1000 && index < SUFFIXES.length - 1) {
    num /= 1000;
    index++;
  }
  
  // Normalize downwards (e.g., 0.5M -> 500K)
  while (num > 0 && num < 1 && index > 0) {
    num *= 1000;
    index--;
  }
  
  // Format to avoid long decimals (e.g., 1.555 -> 1.56)
  num = Number(num.toFixed(2));
  
  return { 
    valid: true, 
    formatted: `${num}${SUFFIX_FORMATTED[index]}` 
  };
};

module.exports.config = {
  name: "slot",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Play the slot machine (Strict 50% win chance, Up to Googol)",
  commandCategory: "games",
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
      return api.sendMessage("⚠️ | 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭 𝐭𝐲𝐩𝐞! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐮𝐬𝐞 𝐯𝐚𝐥𝐢𝐝 𝐬𝐮𝐟𝐟𝐢𝐱𝐞𝐬 (𝐞.𝐠., 𝐊, 𝐌, 𝐁... 𝐮𝐩 𝐭𝐨 𝐆𝐆).", event.threadID, event.messageID);
    }

    const bet = betInfo.formatted; 
    const uid = event.senderID;
    
    // Step 1: Deduct the bet FIRST
    const deductUrl = `https://mahimcraft.alwaysdata.net/economy/?type=deduct&uid=${uid}&quantity=${bet}&notes=Slot+Bet`;
    const deductRes = await axios.get(deductUrl);
    
    if (deductRes.data.status !== "success") {
      return api.sendMessage(`⚠️ | ${deductRes.data.message}`, event.threadID, event.messageID);
    }

    // Step 2: STRICT 50% Win Chance
    const isWin = Math.random() < 0.5; 
    let profitMultiplier = 0;
    
    const slots = ["🍒", "🍇", "🍉", "🍓", "🍋", "🔔", "💎"];
    let e1, e2, e3;

    if (!isWin) {
      const shuffled = shuffle([...slots]);
      e1 = shuffled[0]; e2 = shuffled[1]; e3 = shuffled[2];
    } else {
      const isJackpot = Math.random() < 0.2; 
      const shuffled = shuffle([...slots]);
      
      if (isJackpot) {
        profitMultiplier = 3;
        e1 = shuffled[0]; e2 = shuffled[0]; e3 = shuffled[0];
      } else {
        profitMultiplier = 2;
        e1 = shuffled[0]; e2 = shuffled[0]; e3 = shuffled[1];
      }
    }

    // Step 3: Smart Winnings Payout
    if (isWin) {
      const totalPayoutMultiplier = profitMultiplier + 1; 
      const payoutAmount = validateAndNormalize(bet, totalPayoutMultiplier).formatted;
      
      const addUrl = `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${payoutAmount}&notes=Slot+Win`;
      
      // DELAY 2 seconds to ensure database writes safely
      await new Promise(resolve => setTimeout(resolve, 2000));
      const addRes = await axios.get(addUrl);
      
      if (addRes.data.status !== "success") {
        return api.sendMessage(`⚠️ | 𝐄𝐫𝐫𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐰𝐢𝐧𝐧𝐢𝐧𝐠𝐬: ${addRes.data.message}`, event.threadID, event.messageID);
      }
    }

    // Step 4: Formatting the NARROW mobile-friendly output
    const profitAmountStr = validateAndNormalize(bet, profitMultiplier).formatted;

    let msg = `🎰 𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄 🎰\n`;
    msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += ` ► [ ${e1} | ${e2} | ${e3} ] ◄\n`;
    msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    
    if (isWin) {
      if (profitMultiplier === 3) {
        msg += `🎉 𝐉𝐀𝐂𝐊𝐏𝐎𝐓! (𝟑𝐗)\n➕ 💲${profitAmountStr}`;
      } else {
        msg += `✅ 𝐘𝐎𝐔 𝐖𝐎𝐍! (𝟐𝐗)\n➕ 💲${profitAmountStr}`;
      }
    } else {
      msg += `📛 𝐘𝐎𝐔 𝐋𝐎𝐒𝐓!\n➖ 💲${bet}`;
    }

    return api.sendMessage(msg, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝.", event.threadID, event.messageID);
  }
};
