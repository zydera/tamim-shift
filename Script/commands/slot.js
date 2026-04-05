const axios = require("axios");

// Helper function to shuffle an array
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Helper function to multiply text-based numbers (e.g., "5.5K" * 2 = "11K")
const multiplyBetAmount = (amountStr, multiplier) => {
  const cleanStr = String(amountStr).replace(/,/g, '').trim();
  const match = cleanStr.match(/^([0-9.]+)([a-zA-Z]*)$/);
  
  if (!match) return amountStr; 
  
  const num = parseFloat(match[1]);
  const suffix = match[2] ? match[2].toUpperCase() : "";
  const calculated = parseFloat((num * multiplier).toFixed(2)); 
  
  return calculated + suffix;
};

module.exports.config = {
  name: "slot",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Play the slot machine",
  commandCategory: "economy",
  usages: "[amount]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const bet = args[0];
    if (!bet) return api.sendMessage("⚠️ | 𝐄𝐧𝐭𝐞𝐫 𝐛𝐞𝐭 𝐚𝐦𝐨𝐮𝐧𝐭.", event.threadID, event.messageID);

    const uid = event.senderID;
    
    // Step 1: Deduct the bet amount FIRST to verify sufficient balance
    const deductUrl = `https://mahimcraft.alwaysdata.net/economy/?type=deduct&uid=${uid}&quantity=${bet}&notes=Slot+Bet`;
    const deductRes = await axios.get(deductUrl);
    
    if (deductRes.data.status !== "success") {
      return api.sendMessage(`⚠️ | ${deductRes.data.message}`, event.threadID, event.messageID);
    }

    // Step 2: Determine Win or Loss (Exactly 50% chance)
    const isWin = Math.random() < 0.5;
    let profitMultiplier = 0;
    
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
        profitMultiplier = 3;
        resultEmojis = [shuffled[0], shuffled[0], shuffled[0]];
      } else {
        profitMultiplier = 2;
        resultEmojis = shuffle([shuffled[0], shuffled[0], shuffled[1]]);
      }
    }

    // Step 3: Smart Winnings Payout (Fixing the rate limit and math)
    if (isWin) {
      // If profit is 2X, we must add 3X the bet (1X to refund the deduct + 2X profit)
      const totalPayoutMultiplier = profitMultiplier + 1; 
      const payoutAmount = multiplyBetAmount(bet, totalPayoutMultiplier);
      
      const addUrl = `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${payoutAmount}&notes=Slot+Win`;
      
      // DELAY 1.5 seconds so the API doesn't block the request as spam!
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const addRes = await axios.get(addUrl);
      
      // Error handling just in case the API still fails
      if (addRes.data.status !== "success") {
        return api.sendMessage(`⚠️ | 𝐄𝐫𝐫𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐰𝐢𝐧𝐧𝐢𝐧𝐠𝐬: ${addRes.data.message}`, event.threadID, event.messageID);
      }
    }

    // Step 4: Formatting the NARROW mobile-friendly output
    const profitAmountStr = multiplyBetAmount(bet, profitMultiplier);
    const betUpper = bet.toUpperCase();

    let msg = `🎰 𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄 🎰\n`;
    msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += ` ► [ ${resultEmojis[0]} | ${resultEmojis[1]} | ${resultEmojis[2]} ] ◄\n`;
    msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    
    if (isWin) {
      if (profitMultiplier === 3) {
        msg += `🎉 𝐉𝐀𝐂𝐊𝐏𝐎𝐓! (𝟑𝐗)\n➕ 💲${profitAmountStr}`;
      } else {
        msg += `✅ 𝐌𝐀𝐓𝐂𝐇𝐄𝐃! (𝟐𝐗)\n➕ 💲${profitAmountStr}`;
      }
    } else {
      msg += `❌ 𝐘𝐎𝐔 𝐋𝐎𝐒𝐓!\n➖ 💲${betUpper}`;
    }

    return api.sendMessage(msg, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝.", event.threadID, event.messageID);
  }
};
