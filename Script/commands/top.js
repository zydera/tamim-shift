const axios = require("axios");

// Helper to convert rank name to mathematical sans-serif (𝗅𝗂𝗄𝖾 𝗍𝗁𝗂𝗌 𝖿𝗈𝗇𝗍)
const toSansMath = (str) => {
  const map = {'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓', 'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹'};
  return String(str).replace(/[a-zA-Z]/g, m => map[m] || m);
};

// Helper for Footer (Math Sans Bold)
const toSansBold = (str) => {
  const map = {'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝘀','t':'𝘁','u':'𝘂','v':'𝘃','w':'𝘄','x':'𝘅','y':'𝘆','z':'𝘇', 'A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭', '0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'};
  return String(str).replace(/[a-zA-Z0-9]/g, m => map[m] || m);
};

// Helper to convert numbers to bold serif for the ranks
const toBoldNum = (num) => {
  const map = {'0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗'};
  return String(num).replace(/[0-9]/g, m => map[m] || m);
};

// Helper for medal emojis and bold numbers
const getMedal = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `[${toBoldNum(rank)}]`;
};

module.exports.config = {
  name: "top",
  version: "1.0.5",
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
      let msg = `🏆 𝐋𝐄𝐀𝐃𝐄𝐑𝐁𝐎𝐀𝐑𝐃\n`;
      msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
      
      data.data.forEach(user => {
        const medal = getMedal(user.rank_num);
        const rankName = toSansMath(user.rank_name);
        
        msg += `${medal} ${user.name}\n`;
        msg += ` ↳ ${user.total} • ❨${rankName}❩\n`;
      });

      const footerPage = toSansBold(`Page ${page}`);
      msg += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
      msg += ` 📄 ${footerPage}`;

      return api.sendMessage(msg.trim(), event.threadID, (err, info) => {
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
