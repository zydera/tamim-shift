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

const toBoldNum = (str) => String(str).replace(/[0-9hms]/g, m => ({'0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗','h':'𝐡','m':'𝐦','s':'𝐬'}[m] || m));
const toSansBold = (str) => String(str).replace(/[a-zA-Z]/g, m => ({'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝘀','t':'𝘁','u':'𝘂','v':'𝘃','w':'𝘄','x':'𝘅','y':'𝘆','z':'𝘇','A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭'}[m] || m));

// Loot Table (Exactly 40% Trash, 60% Fish)
const LOOT_TABLE = [
  // --- 40% TRASH (Loss, -1X Profit) ---
  { name: "𝐓𝐀𝐍𝐆𝐋𝐄𝐃 𝐒𝐄𝐀𝐖𝐄𝐄𝐃", emoji: "🌿", pureProfit: -1, chance: 12 },
  { name: "𝐎𝐋𝐃 𝐁𝐎𝐎𝐓", emoji: "🥾", pureProfit: -1, chance: 8 },
  { name: "𝐑𝐔𝐒𝐓𝐘 𝐂𝐀𝐍", emoji: "🥫", pureProfit: -1, chance: 8 },
  { name: "𝐏𝐋𝐀𝐒𝐓𝐈𝐂 𝐁𝐀𝐆", emoji: "🛍️", pureProfit: -1, chance: 8 },
  { name: "𝐃𝐑𝐈𝐅𝐓𝐖𝐎𝐎𝐃", emoji: "🪵", pureProfit: -1, chance: 4 },

  // --- 60% FISH (Break Even or Pure Profit) ---
  { name: "𝐓𝐈𝐍𝐘 𝐒𝐇𝐑𝐈𝐌𝐏", emoji: "🦐", pureProfit: 0, chance: 20 }, // 0 = Break even
  { name: "𝐂𝐎𝐌𝐌𝐎𝐍 𝐂𝐀𝐑𝐏", emoji: "🐟", pureProfit: 1.5, chance: 15 },
  { name: "𝐑𝐀𝐑𝐄 𝐏𝐔𝐅𝐅𝐄𝐑𝐅𝐈𝐒𝐇", emoji: "🐡", pureProfit: 2, chance: 12 },
  { name: "𝐁𝐋𝐔𝐄 𝐌𝐀𝐑𝐋𝐈𝐍", emoji: "🐠", pureProfit: 3, chance: 7 },
  { name: "𝐆𝐈𝐀𝐍𝐓 𝐒𝐐𝐔𝐈𝐃", emoji: "🦑", pureProfit: 5, chance: 4 },
  { name: "𝐆𝐑𝐄𝐀𝐓 𝐖𝐇𝐈𝐓𝐄 𝐒𝐇𝐀𝐑𝐊", emoji: "🦈", pureProfit: 10, chance: 1.5 },
  { name: "𝐌𝐘𝐓𝐇𝐈𝐂𝐀𝐋 𝐋𝐄𝐕𝐈𝐀𝐓𝐇𝐀𝐍", emoji: "🐉", pureProfit: 25, chance: 0.5 }
];

module.exports.config = {
  name: "fish",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Go deep sea fishing",
  commandCategory: "games",
  usages: "[bet] or info",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const rawBet = args[0];
    if (!rawBet) return api.sendMessage("⚠️ | 𝐄𝐧𝐭𝐞𝐫 𝐛𝐚𝐢𝐭 𝐜𝐨𝐬𝐭 𝐨𝐫 '𝐢𝐧𝐟𝐨'.", event.threadID, event.messageID);
    const uid = event.senderID;

    // --- INFO MENU ---
    if (rawBet.toLowerCase() === "info") {
      const infoUrl = `https://mahimcraft.alwaysdata.net/economy/?type=progress&uid=${uid}&event_1=fish&limit_1=20&time_1=180`;
      const res = await axios.get(infoUrl);
      if (res.data.status === "success") {
        const prog = res.data.progress.fish;
        let msg = `🎣 ${toSansBold("FISHING INFO")} 🎣\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
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
    const deductUrl = `https://mahimcraft.alwaysdata.net/economy/?type=deduct&uid=${uid}&quantity=${bet}&notes=Fish+Bet&min=1K&max=20M&event=fish&limit=20&time=180`;
    const deductRes = await axios.get(deductUrl);
    if (deductRes.data.status !== "success") return api.sendMessage(deductRes.data.message, event.threadID, event.messageID);

    const roll = Math.random() * 100;
    let cumulativeChance = 0;
    let catchResult = LOOT_TABLE[0]; 

    for (const item of LOOT_TABLE) {
      cumulativeChance += item.chance;
      if (roll <= cumulativeChance) { catchResult = item; break; }
    }

    const pureProfit = catchResult.pureProfit;
    let addMultiplier = 0;

    if (pureProfit === 0) addMultiplier = 1; 
    else if (pureProfit > 0) addMultiplier = pureProfit + 1; 

    if (addMultiplier > 0) {
      const payoutAmount = validateAndNormalize(bet, addMultiplier).formatted;
      const addUrl = `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${payoutAmount}&notes=Fish+Win`;
      await new Promise(resolve => setTimeout(resolve, 2000));
      await axios.get(addUrl);
    }

    let msg = `🎣 ${toSansBold("DEEP SEA FISHING")} 🎣\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += ` 🌊 𝘠𝘰𝘶 𝘤𝘢𝘴𝘵 𝘺𝘰𝘶𝘳 𝘭𝘪𝘯𝘦...\n`;
    msg += ` ${catchResult.emoji} 𝐘𝐨𝐮 𝐜𝐚𝐮𝐠𝐡𝐭: ${catchResult.name}!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;

    if (pureProfit > 0) {
      const profitStr = validateAndNormalize(bet, pureProfit).formatted;
      msg += `🎉 𝐀𝐌𝐀𝐙𝐈𝐍𝐆 𝐂𝐀𝐓𝐂𝐇! (${pureProfit}𝐗)\n➕ 💲${profitStr} (${toSansBold("Pure Profit")})`;
    } else if (pureProfit === 0) {
      msg += `♻️ 𝐁𝐑𝐄𝐀𝐊 𝐄𝐕𝐄𝐍! (𝟏𝐗)\n➕ 💲${bet.toUpperCase()}`;
    } else {
      msg += `📛 𝐓𝐑𝐀𝐒𝐇 𝐂𝐀𝐓𝐂𝐇!\n➖ 💲${bet.toUpperCase()}`;
    }
    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (error) { return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID, event.messageID); }
};
