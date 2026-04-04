const axios = require("axios");

// Helper to convert rank name to mathematical sans-serif
const toSansMath = (str) => {
  const map = {'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓', 'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹'};
  return str.replace(/[a-zA-Z]/g, m => map[m] || m);
};

// Helper for medel emojis
const getMedal = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `[${rank}]`;
};

module.exports.config = {
  name: "top",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "View leaderboard",
  commandCategory: "economy",
  usages: "[page]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const page = args[0] || 1;
    const apiUrl = `https://mahimcraft.alwaysdata.net/economy/?type=leaderboard&page=${page}`;
    
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status === "success" && data.data.length > 0) {
      let msg = `╭── 🏆 𝖫𝖾𝖺𝖽𝖾𝗋𝖻𝗈𝖺𝗋𝖽 • 𝖯𝖺𝗀𝖾 ${page} ──╮\n`;
      
      data.data.forEach(user => {
        const medal = getMedal(user.rank_num);
        const rankName = toSansMath(user.rank_name);
        
        msg += `│ ${medal} ${user.name}\n│ ╰─ ${user.total} • ❨${rankName}❩\n`;
      });

      msg += `╰────────────────────╯`;

      return api.sendMessage(msg, event.threadID, (err, info) => {
        if (!err) {
          setTimeout(() => api.unsendMessage(info.messageID), 30000); 
        }
      }, event.messageID);
      
    } else {
      return api.sendMessage("⚠️ | 𝐄𝐦𝐩𝐭𝐲.", event.threadID, event.messageID);
    }
  } catch (error) {
    return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID, event.messageID);
  }
};
