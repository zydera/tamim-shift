const axios = require("axios");

// Helper function to shuffle an array (for randomizing slot positions)
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Helper function to multiply text-based numbers (e.g., "5.5K" * 2 = "11K")
const multiplyBetAmount = (amountStr, multiplier) => {
  // Remove commas for calculation if the user inputted something like "10,000"
  const cleanStr = String(amountStr).replace(/,/g, '').trim();
  const match = cleanStr.match(/^([0-9.]+)([a-zA-Z]*)$/);
  
  if (!match) return amountStr; // Fallback if parsing fails
  
  const num = parseFloat(match[1]);
  const suffix = match[2] ? match[2].toUpperCase() : "";
  const calculated = parseFloat((num * multiplier).toFixed(2)); // Avoids long decimals
  
  return calculated + suffix;
};

module.exports.config = {
  name: "slot",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Play the slot machine (50% win chance)",
  commandCategory: "economy",
  usages: "[amount]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const bet = args[0];
    if (!bet) return api.sendMessage("⚠️ | 𝐄𝐧𝐭𝐞𝐫 𝐛𝐞𝐭 𝐚𝐦𝐨𝐮𝐧𝐭.", event.threadID, event.messageID);

    const uid = event.senderID;
    
    // Step 1: Deduct the bet amount first to check if they have enough balance
    const deductUrl = `https://mahimcraft.alwaysdata.net/economy/?type=deduct&uid=${uid}&quantity=${bet}&notes=Slot+Bet`;
    const deductRes = await axios.get(deductUrl);
    
    if (deductRes.data.status !== "success") {
      return api.sendMessage(`⚠️ | ${deductRes.data.message}`, event.threadID, event.messageID);
    }

    // Step 2: Determine Win or Loss (Exactly 50% chance)
    const isWin = Math.random() < 0.5;
    let multiplier = 0;
    
    // Emojis to use in the slot machine
    const slots = ["🍒", "🍇", "🍉", "🍓", "🍋", "🔔", "💎"];
    let resultEmojis = [];

    if (!isWin) {
      // LOSE: 3 different emojis
      const shuffled = shuffle([...slots]);
      resultEmojis = [shuffled[0], shuffled[1], shuffled[2]];
    } else {
      // WIN: Determine if 2X (80% of wins) or 3X (20% of wins)
      const isJackpot = Math.random() < 0.2; 
      const shuffled = shuffle([...slots]);
      
      if (isJackpot) {
        multiplier = 3;
        // 3 of the same emoji
        resultEmojis = [shuffled[0], shuffled[0], shuffled[0]];
      } else {
        multiplier = 2;
        // 2 of the same emoji, 1 different
        resultEmojis = shuffle([shuffled[0], shuffled[0], shuffled[1]]);
      }
    }

    // Step 3: If won, add the winnings!
    if (isWin) {
      const addUrl = `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${bet}&notes=Slot+Win`;
      // Call the add API 'multiplier' times to give the correct total payout
      for (let i = 0; i < multiplier; i++) {
        await axios.get(addUrl);
      }
    }

    // Step 4: Formatting the beautiful output
    let msg = `╭─── 🎰 𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄 ───╮\n`;
    msg += `│\n`;
    msg += `│       [ ${resultEmojis[0]} | ${resultEmojis[1]} | ${resultEmojis[2]} ]\n`;
    msg += `│\n`;
    
    if (isWin) {
      const wonAmount = multiplyBetAmount(bet, multiplier);
      if (multiplier === 3) {
        msg += `╰─ 🎉 𝐉𝐀𝐂𝐊𝐏𝐎𝐓! 𝐘𝐨𝐮 𝐰𝐨𝐧 💲${wonAmount}.`;
      } else {
        msg += `╰─ ✅ 𝐌𝐀𝐓𝐂𝐇! 𝐘𝐨𝐮 𝐰𝐨𝐧 💲${wonAmount}.`;
      }
    } else {
      msg += `╰─ ❌ 𝐋𝐎𝐒𝐓! 𝐘𝐨𝐮 𝐥𝐨𝐬𝐭 💲${bet.toUpperCase()}.`;
    }

    return api.sendMessage(msg, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID, event.messageID);
  }
};
