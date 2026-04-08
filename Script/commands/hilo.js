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
  return { valid: true, formatted: `${Number(num.toFixed(2))}${SUFFIX_FORMATTED[index]}` };
};

// Font Helpers
const toBoldNum = (str) => String(str).replace(/[0-9]/g, m => ({'0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗'}[m] || m));
const toSansBold = (str) => String(str).replace(/[a-zA-Z]/g, m => ({'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝘀','t':'𝘁','u':'𝘂','v':'𝘃','w':'𝘄','x':'𝘅','y':'𝘆','z':'𝘇','A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗗'}[m] || m));
const toSansNormal = (str) => String(str).replace(/[a-zA-Z]/g, m => ({'a':'𝖺','b':'𝖻','c':'𝖼','d':'𝖽','e':'𝖾','f':'𝖿','g':'𝗀','h':'𝗁','i':'𝗂','j':'𝗃','k':'𝗄','l':'𝗅','m':'𝗆','n':'𝗇','o':'𝗈','p':'𝗉','q':'𝗊','r':'𝗋','s':'𝗌','t':'𝗍','u':'𝗎','v':'𝗏','w':'𝗐','x':'𝗑','y':'𝗒','z':'𝗓','A':'𝖠','B':'𝖡','C':'𝖢','D':'𝖣','E':'𝖤','F':'𝖥','G':'𝖦','H':'𝖧','I':'𝖨','J':'𝖩','K':'𝖪','L':'𝖫','M':'𝖬','N':'𝖭','O':'𝖮','P':'𝖯','Q':'𝖰','R':'𝖱','S':'𝖲','T':'𝖳','U':'𝖴','V':'𝖵','W':'𝖶','X':'𝖷','Y':'𝖸','Z':'𝖹'}[m] || m));

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports.config = {
  name: "hilo",
  version: "1.4.0",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Guess Higher or Lower using reactions",
  commandCategory: "games",
  usages: "[bet] or info",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const rawBet = args[0];
    if (!rawBet) return api.sendMessage("⚠️ | 𝐄𝐧𝐭𝐞𝐫 𝐛𝐞𝐭 𝐚𝐦𝐨𝐮𝐧𝐭 𝐨𝐫 '𝐢𝐧𝐟𝐨'.", event.threadID, event.messageID);
    const uid = event.senderID;

    // --- INFO MENU ---
    if (rawBet.toLowerCase() === "info") {
      const infoUrl = `https://mahimcraft.alwaysdata.net/economy/?type=progress&uid=${uid}&event_1=hilo&limit_1=20`;
      const res = await axios.get(infoUrl);
      if (res.data.status === "success") {
        const prog = res.data.progress.hilo;
        let msg = `🃏 ${toSansBold("HILO INFO")} 🃏\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
        msg += ` ${toSansBold("Min Bet")}: [ ${toBoldNum("1K")} ]\n`;
        msg += ` ${toSansBold("Max Bet")}: [ ${toBoldNum("20M")} ]\n`;
        msg += ` ${toSansBold("Progress")}: [ ${toBoldNum(prog.current)} / ${toBoldNum(prog.max)} ]\n`;
        if (prog.status === "limit_reached") msg += ` ${toSansBold("Cooldown")}: [ ${toBoldNum(prog.countdown)} ]\n`;
        msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`;
        return api.sendMessage(msg, event.threadID, event.messageID);
      }
    }

    const betInfo = validateAndNormalize(rawBet, 1);
    if (!betInfo.valid) return api.sendMessage("⚠️ | 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭!", event.threadID, event.messageID);
    const bet = betInfo.formatted; 
    
    // --- API DEDUCT + LIMITS ENFORCEMENT ---
    const deductUrl = `https://mahimcraft.alwaysdata.net/economy/?type=deduct&uid=${uid}&quantity=${bet}&notes=HiLo+Bet&min=1K&max=20M&event=hilo&limit=20`;
    const deductRes = await axios.get(deductUrl);
    if (deductRes.data.status !== "success") return api.sendMessage(deductRes.data.message, event.threadID, event.messageID);

    const num1 = randomInt(1, 100); 
    
    // Gorgeous Visual Preview
    let msg = `🃏 ${toSansBold("HIGH OR LOW")} 🃏\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += ` 🔢 ${toSansBold("Current Number")}: [ ${toBoldNum(num1)} ]\n`;
    msg += ` 🆕 ${toSansBold("Next Number")}: [ ？]\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += `${toSansNormal("React in")} 𝟹𝟶𝗌>>>\n`;
    msg += `👍 = 𝐇𝐢𝐠𝐡𝐞𝐫 | 😮 = 𝐋𝐨𝐰𝐞𝐫`;

    return api.sendMessage(msg, event.threadID, async (error, info) => {
      if (!error) {
        global.client.handleReaction.push({
          name: this.config.name,
          messageID: info.messageID,
          author: uid,
          betAmount: bet,
          firstNumber: num1,
          answerYet: 0
        });

        // 30 SECOND TIMEOUT LOGIC
        await new Promise(resolve => setTimeout(resolve, 30 * 1000));
        
        const indexOfHandle = global.client.handleReaction.findIndex(e => e.messageID === info.messageID);
        if (indexOfHandle !== -1) {
          let data = global.client.handleReaction[indexOfHandle];
          if (data.answerYet === 0) {
            global.client.handleReaction.splice(indexOfHandle, 1); // Clean up memory
            
            // 1. Unsend the Prompt Instantly
            api.unsendMessage(info.messageID); 

            // 2. Automatically Refund 80%
            const refundStr = validateAndNormalize(bet, 0.8).formatted;
            const addUrl = `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${refundStr}&notes=HiLo+Refund`;
            await axios.get(addUrl);
            
            // 3. Notify the user they timed out but got 80% back
            return api.sendMessage(`⏳ | ${toSansBold("Time out! You took too long.")}\n♻️ ${toSansBold("Refunded")}: 💲${refundStr} (80%)`, event.threadID);
          }
        }
      }
    });
  } catch (error) { return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID, event.messageID); }
};

module.exports.handleReaction = async function ({ api, event, handleReaction }) {
  try {
    if (event.userID !== handleReaction.author) return;

    let choice = "";
    if (event.reaction === "👍") choice = "H";
    else if (event.reaction === "😮") choice = "L";
    else return; // Ignore accidental reactions

    // Mark as answered and instantly unsend the original message!
    handleReaction.answerYet = 1;
    api.unsendMessage(handleReaction.messageID);

    const num1 = handleReaction.firstNumber;
    const bet = handleReaction.betAmount;
    const uid = event.userID;

    // --- GUARANTEED 60% ALGORITHM ---
    const forceWin = Math.random() < 0.60;
    let num2;

    if (forceWin) {
      if (choice === "H") num2 = randomInt(num1 + 1, 100);
      else num2 = randomInt(1, num1 - 1);
    } else {
      if (choice === "H") num2 = randomInt(1, num1);
      else num2 = randomInt(num1, 100);
    }

    if (num2 > 100) num2 = 100;
    if (num2 < 1) num2 = 1;
    if (isNaN(num2)) num2 = num1; 

    let isWin = false;
    let isTie = false;
    if (num2 === num1) isTie = true;
    else if (choice === "H" && num2 > num1) isWin = true;
    else if (choice === "L" && num2 < num1) isWin = true;

    const indexOfHandle = global.client.handleReaction.findIndex(e => e.messageID === handleReaction.messageID);
    if (indexOfHandle !== -1) global.client.handleReaction.splice(indexOfHandle, 1);

    // --- TOTAL PAYOUT CALCULATION (Like Dice) ---
    let totalPayoutMultiplier = 0; 
    if (isWin) totalPayoutMultiplier = 2; // Win gives 2X total (Refund + Profit)
    else if (isTie) totalPayoutMultiplier = 1; // Tie gives 1X total (Refund only)

    let payoutAmountStr = "0";

    if (totalPayoutMultiplier > 0) {
      payoutAmountStr = validateAndNormalize(bet, totalPayoutMultiplier).formatted;
      const addUrl = `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${payoutAmountStr}&notes=HiLo+Win`;
      await new Promise(resolve => setTimeout(resolve, 1500));
      await axios.get(addUrl);
    }

    let msg = `🃏 ${toSansBold("HIGH OR LOW")} 🃏\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += ` 🔢 ${toSansBold("Old Number")}: [ ${toBoldNum(num1)} ]\n`;
    msg += ` 🆕 ${toSansBold("New Number")}: [ ${toBoldNum(num2)} ]\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;

    if (isWin) {
      msg += `✅ 𝐘𝐎𝐔 𝐖𝐎𝐍!\n➕ 💲${payoutAmountStr}`;
    } else if (isTie) {
      msg += `♻️ 𝐈𝐓'𝐒 𝐀 𝐓𝐈𝐄!\n➕ 💲${bet.toUpperCase()}`;
    } else {
      msg += `📛 𝐘𝐎𝐔 𝐋𝐎𝐒𝐓!\n➖ 💲${bet.toUpperCase()}`;
    }
    
    return api.sendMessage(msg, event.threadID);
  } catch (error) { return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID); }
};
