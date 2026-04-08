const axios = require("axios");
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

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

const toBoldNum = (str) => String(str).replace(/[0-9hms]/g, m => ({'0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗','h':'𝐡','m':'𝐦','s':'𝐬'}[m] || m));
const toSansBold = (str) => String(str).replace(/[a-zA-Z]/g, m => ({'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝘀','t':'𝘁','u':'𝘂','v':'𝘃','w':'𝘄','x':'𝘅','y':'𝘆','z':'𝘇','A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭'}[m] || m));

module.exports.config = {
  name: "slot",
  version: "1.1.2",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Play the slot machine",
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
      const infoUrl = `https://mahimcraft.alwaysdata.net/economy/?type=progress&uid=${uid}&event_1=slot&limit_1=20&time_1=180`;
      const res = await axios.get(infoUrl);
      if (res.data.status === "success") {
        const prog = res.data.progress.slot;
        let msg = `🎰 ${toSansBold("SLOT INFO")} 🎰\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
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
    const deductUrl = `https://mahimcraft.alwaysdata.net/economy/?type=deduct&uid=${uid}&quantity=${bet}&notes=Slot+Bet&min=1K&max=20M&event=slot&limit=20&time=180`;
    const deductRes = await axios.get(deductUrl);
    if (deductRes.data.status !== "success") return api.sendMessage(deductRes.data.message, event.threadID, event.messageID);

    // --- 60% WIN CHANCE ---
    const isWin = Math.random() < 0.60; 
    let profitMultiplier = 0;
    const slots = ["🍒", "🍇", "🍉", "🍓", "🍋", "🔔", "💎"];
    let e1, e2, e3;

    if (!isWin) {
      const shuffled = shuffle([...slots]);
      e1 = shuffled[0]; e2 = shuffled[1]; e3 = shuffled[2];
    } else {
      const isJackpot = Math.random() < 0.2; 
      const shuffled = shuffle([...slots]);
      if (isJackpot) { profitMultiplier = 3; e1 = shuffled[0]; e2 = shuffled[0]; e3 = shuffled[0]; } 
      else { profitMultiplier = 2; e1 = shuffled[0]; e2 = shuffled[0]; e3 = shuffled[1]; }
    }

    if (isWin) {
      const totalPayoutMultiplier = profitMultiplier + 1; 
      const payoutAmount = validateAndNormalize(bet, totalPayoutMultiplier).formatted;
      const addUrl = `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${payoutAmount}&notes=Slot+Win`;
      await new Promise(resolve => setTimeout(resolve, 2000));
      await axios.get(addUrl);
    }

    const profitAmountStr = validateAndNormalize(bet, profitMultiplier).formatted;
    let msg = `🎰 ${toSansBold("SLOT MACHINE")} 🎰\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += ` ► [ ${e1} | ${e2} | ${e3} ] ◄\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    
    if (isWin) {
      if (profitMultiplier === 3) msg += `🎉 𝐉𝐀𝐂𝐊𝐏𝐎𝐓! (𝟑𝐗)\n➕ 💲${profitAmountStr} (${toSansBold("Pure Profit")})`;
      else msg += `✅ 𝐘𝐎𝐔 𝐖𝐎𝐍! (𝟐𝐗)\n➕ 💲${profitAmountStr} (${toSansBold("Pure Profit")})`;
    } else {
      msg += `📛 𝐘𝐎𝐔 𝐋𝐎𝐒𝐓!\n➖ 💲${bet}`;
    }
    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (error) { return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID, event.messageID); }
};
