const axios = require("axios");

module.exports.config = {
  name: "vault",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Check own vault balance",
  commandCategory: "economy",
  cooldowns: 5
};

module.exports.run = async ({ api, event, Users }) => {
  try {
    const uid = event.senderID;
    const name = await Users.getNameUser(uid) || "User";

    const { data } = await axios.get(
      `https://mahimcraft.alwaysdata.net/economy/?type=vault_check&uid=${uid}&name=${encodeURIComponent(name)}`
    );

    if (data.status !== "success") {
      return api.sendMessage(`⚠️ | ${data.message || "Error"}`, event.threadID, event.messageID);
    }

    api.sendMessage(
      `🎀 ${name}\n\n𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮𝐫 𝐯𝐚𝐮𝐥𝐭: {data.vault_formatted}`,
      event.threadID,
      event.messageID
    );

  } catch {
    api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID, event.messageID);
  }
};