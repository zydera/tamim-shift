const axios = require("axios");

const SUFFIXES = ["", "K", "M", "B", "T", "QA", "QI", "SX", "SP", "OC", "NO", "D", "UD", "DD", "TD", "QAD", "QID", "SXD", "SPD", "OCD", "NOD", "VG", "UVG", "DVG", "TVG", "QAVG", "QIVG", "SXVG", "SPVG", "OCVG", "NOVG", "TG", "UTG", "DTG", "GG"];
const SUFFIX_FORMATTED = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "D", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg", "Tg", "Utg", "Dtg", "GG"];

const validateAndNormalize = (amountStr, multiplier = 1) => {
  const cleanStr = String(amountStr).replace(/,/g, '').trim();
  const match = cleanStr.match(/^([0-9.]+)([a-zA-Z]*)$/);
  if (!match) return { valid: false };
  let num = parseFloat(match[1]);
  let suffix = match[2].toUpperCase();
  let index = SUFFIXES.indexOf(suffix);
  if (index === -1) return { valid: false }; 
  num *= multiplier;
  while (num >= 1000 && index < SUFFIXES.length - 1) { num /= 1000; index++; }
  while (num > 0 && num < 1 && index > 0) { num *= 1000; index--; }
  num = Number(num.toFixed(2));
  return { valid: true, formatted: `${num}${SUFFIX_FORMATTED[index]}` };
};

// Formatting Helpers
const toBoldNum = (str) => {
  const map = {'0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗', 'h':'𝐡','m':'𝐦','s':'𝐬'};
  return String(str).replace(/[0-9hms]/g, m => map[m] || m);
};
const toSansBold = (str) => {
  const map = {'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝘀','t':'𝘁','u':'𝘂','v':'𝘃','w':'𝘄','x':'𝘅','y':'𝘆','z':'𝘇', 'A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭'};
  return String(str).replace(/[a-zA-Z]/g, m => map[m] || m);
};

const getDiceFace = (num) => ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][num];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports.config = {
  name: "dice",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Play against the bot in a dice roll (60% Win Chance)",
  commandCategory: "games",
  usages: "[amount] or info",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const rawBet = args[0];
    if (!rawBet) return api.sendMessage("⚠️ | 𝐄𝐧𝐭𝐞𝐫 𝐛𝐞𝐭 𝐚𝐦𝐨𝐮𝐧𝐭 𝐨𝐫 '𝐢𝐧𝐟𝐨'.", event.threadID, event.messageID);
    const uid = event.senderID;

    // --- INFO MENU ---
    if (rawBet.toLowerCase() === "info") {
      const infoUrl = `https://mahimcraft.alwaysdata.net/economy/?type=progress&uid=${uid}&event_1=dice&limit_1=20`;
      const res = await axios.get(infoUrl);
      if (res.data.status === "success") {
        const prog = res.data.progress.dice;
        let msg = `🎲 ${toSansBold("DICE INFO")} 🎲\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
        msg += ` ${toSansBold("Min Bet")}: [ ${toBoldNum("1K")} ]\n`;
        msg += ` ${toSansBold("Max Bet")}: [ ${toBoldNum("20M")} ]\n`;
        msg += ` ${toSansBold("Progress")}: [ ${toBoldNum(prog.current)} / ${toBoldNum(prog.max)} ]\n`;
        if (prog.status === "limit_reached") msg += ` ${toSansBold("Cooldown")}: [ ${toBoldNum(prog.countdown)} ]\n`;
        msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`;
        return api.sendMessage(msg, event.threadID, event.messageID);
      }
    }

    const betInfo = validateAndNormalize(rawBet, 1);
    if (!betInfo.valid) return api.sendMessage("⚠️ | 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭 𝐭𝐲𝐩𝐞!", event.threadID, event.messageID);
    const bet = betInfo.formatted; 
    
    // --- API DEDUCT + LIMITS ENFORCEMENT ---
    const deductUrl = `https://mahimcraft.alwaysdata.net/economy/?type=deduct&uid=${uid}&quantity=${bet}&notes=Dice+Bet&min=1K&max=20M&event=dice&limit=20`;
    const deductRes = await axios.get(deductUrl);
    if (deductRes.data.status !== "success") return api.sendMessage(deductRes.data.message, event.threadID, event.messageID);

    // --- 60% WIN CHANCE ---
    const isWin = Math.random() < 0.60; 
    let playerRoll, botRoll;

    if (isWin) {
      playerRoll = randomInt(4, 6); botRoll = randomInt(1, 3);
    } else {
      playerRoll = randomInt(1, 3); botRoll = randomInt(4, 6);
    }

    // --- TOTAL PAYOUT CALCULATION ---
    let totalPayoutMultiplier = 2; // In Dice, a win pays exactly 2X the bet (Refunds bet + 1X profit)
    let payoutAmountStr = validateAndNormalize(bet, totalPayoutMultiplier).formatted;

    if (isWin) {
      // Add the Total Payout (2X) back to the user's balance
      const addUrl = `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${payoutAmountStr}&notes=Dice+Win`;
      await new Promise(resolve => setTimeout(resolve, 2000));
      await axios.get(addUrl);
    }

    let msg = `🎲 ${toSansBold("DICE ROLL")} 🎲\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += ` 👤 ${toSansBold("You")}: ${getDiceFace(playerRoll)} [${toBoldNum(playerRoll)}]\n`;
    msg += ` 🤖 ${toSansBold("Bot")}: ${getDiceFace(botRoll)} [${toBoldNum(botRoll)}]\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    
    if (isWin) {
      // Shows the Total Amount Received (e.g. ➕ 💲2M)
      msg += `✅ 𝐘𝐎𝐔 𝐖𝐎𝐍!\n➕ 💲${payoutAmountStr}`; 
    } else {
      msg += `📛 𝐘𝐎𝐔 𝐋𝐎𝐒𝐓!\n➖ 💲${bet}`;
    }
    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (error) { return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID, event.messageID); }
};
