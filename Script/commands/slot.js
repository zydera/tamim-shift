const axios = require("axios");

// Shuffle
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Valid suffixes
const SUFFIXES = [
  "", "K", "M", "B", "T",
  "QA", "QI", "SX", "SP",
  "O", "N", "D",
  "UD", "DD", "TD",
  "QAD", "QID", "SXD", "SPD",
  "OD", "ND",
  "V", "UV", "DV", "TV",
  "QAV", "QIV", "SXV", "SPV",
  "OV", "NV",
  "TG", "UTG", "GG"
];

const FORMAT = [
  "", "K", "M", "B", "T",
  "Qa", "Qi", "Sx", "Sp",
  "O", "N", "D",
  "Ud", "Dd", "Td",
  "Qad", "Qid", "Sxd", "Spd",
  "Od", "Nd",
  "V", "Uv", "Dv", "Tv",
  "Qav", "Qiv", "Sxv", "Spv",
  "Ov", "Nv",
  "Tg", "Utg", "GG"
];

// Normalize amount
function money(value, multi = 1) {
  const txt = String(value).replace(/,/g, "").trim();
  const match = txt.match(/^([0-9.]+)([a-zA-Z]*)$/);

  if (!match) return { valid: false };

  let num = parseFloat(match[1]);
  let suffix = match[2].toUpperCase();

  let index = SUFFIXES.indexOf(suffix);
  if (index === -1 || isNaN(num) || num <= 0) return { valid: false };

  num *= multi;

  while (num >= 1000 && index < SUFFIXES.length - 1) {
    num /= 1000;
    index++;
  }

  while (num < 1 && index > 0) {
    num *= 1000;
    index--;
  }

  num = Number(num.toFixed(2));

  return {
    valid: true,
    formatted: `${num}${FORMAT[index]}`
  };
}

module.exports.config = {
  name: "slot",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Slot machine game",
  commandCategory: "games",
  usages: "[amount]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const betRaw = args[0];

    if (!betRaw) {
      return api.sendMessage(
        "⚠️ | 𝐄𝐧𝐭𝐞𝐫 𝐛𝐞𝐭 𝐚𝐦𝐨𝐮𝐧𝐭.",
        event.threadID,
        event.messageID
      );
    }

    const betData = money(betRaw);

    if (!betData.valid) {
      return api.sendMessage(
        "⚠️ | 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭.",
        event.threadID,
        event.messageID
      );
    }

    const bet = betData.formatted;
    const uid = event.senderID;

    // Deduct first
    const deduct = await axios.get(
      `https://mahimcraft.alwaysdata.net/economy/?type=deduct&uid=${uid}&quantity=${bet}&notes=Slot+Bet`
    );

    if (deduct.data.status !== "success") {
      return api.sendMessage(
        deduct.data.message,
        event.threadID,
        event.messageID
      );
    }

    const icons = ["🍒", "🍇", "🍉", "🍓", "🍋", "🔔", "💎"];

    // 60% win
    const isWin = Math.random() < 0.60;

    let e1, e2, e3;
    let profitX = 0;

    if (isWin) {
      // 20% jackpot from wins
      const isJackpot = Math.random() < 0.20;
      const pick = shuffle(icons);

      if (isJackpot) {
        e1 = pick[0];
        e2 = pick[0];
        e3 = pick[0];
        profitX = 3;
      } else {
        e1 = pick[0];
        e2 = pick[0];
        e3 = pick[1];
        profitX = 2;
      }

      // Add reward safely
      const reward = money(bet, profitX + 1);

      if (!reward.valid) {
        throw new Error("Reward parse failed");
      }

      const add = await axios.get(
        `https://mahimcraft.alwaysdata.net/economy/?type=add&uid=${uid}&quantity=${reward.formatted}&notes=Slot+Win`
      );

      if (add.data.status !== "success") {
        return api.sendMessage(
          "⚠️ | Reward failed.",
          event.threadID,
          event.messageID
        );
      }

    } else {
      const pick = shuffle(icons);
      e1 = pick[0];
      e2 = pick[1];
      e3 = pick[2];
    }

    const profit = money(bet, profitX).formatted;

    let msg = `🎰 𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄 🎰\n`;
    msg += `┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    msg += ` ► [ ${e1} | ${e2} | ${e3} ] ◄\n`;
    msg += `┈┈┈┈┈┈┈┈┈┈┈┈\n`;

    if (isWin) {
      if (profitX === 3) {
        msg += `🎉 𝐉𝐀𝐂𝐊𝐏𝐎𝐓! (3X)\n`;
      } else {
        msg += `✅ 𝐘𝐎𝐔 𝐖𝐎𝐍! (2X)\n`;
      }

      msg += `➕ 💲${profit}`;
    } else {
      msg += `📛 𝐘𝐎𝐔 𝐋𝐎𝐒𝐓!\n`;
      msg += `➖ 💲${bet}`;
    }

    return api.sendMessage(msg, event.threadID, event.messageID);

  } catch (err) {
    console.log(err);
    return api.sendMessage(
      "❌ | Error occurred.",
      event.threadID,
      event.messageID
    );
  }
};