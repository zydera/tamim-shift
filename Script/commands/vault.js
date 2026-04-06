const axios = require("axios");

module.exports.config = {
  name: "vault",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Check own vault balance",
  commandCategory: "economy",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const uid = event.senderID;
    let name = await Users.getNameUser(uid) || "User";
    const encodedName = encodeURIComponent(name);
    
    // Uses the specific vault_check endpoint
    const apiUrl = `https://mahimcraft.alwaysdata.net/economy/?type=vault_check&uid=${uid}&name=${encodedName}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status === "success") {
      // Removed the .replace() method and used data.vault_formatted directly
      const msg = `🎀 ${name}\n\n𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮𝐫 𝐯𝐚𝐮𝐥𝐭: ${data.vault_formatted}`;

      return api.sendMessage(msg, event.threadID, event.messageID);
    } else {
      return api.sendMessage(`⚠️ | ${data.message || "Error"}`, event.threadID, event.messageID);
    }
  } catch (error) {
    return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID, event.messageID);
  }
};
