const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "toilet",
    version: "2.0",
    author: "MAHIM ISLAM",
    role: 0,
    category: "fun",
    cooldown: 10,
    guide: "[mention/reply/UID]",
  },

  onStart: async function ({ api, event, args }) {
    const { senderID, mentions, threadID, messageID, messageReply } = event;

    let id;

    if (Object.keys(mentions).length > 0) {
      id = Object.keys(mentions)[0];
    } else if (messageReply) {
      id = messageReply.senderID;
    } else if (args[0]) {
      id = args[0];
    } else {
      return api.sendMessage(
        "🍓 𝐎𝐨𝐩𝐬𝐢𝐞! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 / 𝐫𝐞𝐩𝐥𝐲 / 𝐠𝐢𝐯𝐞 𝐔𝐈𝐃 🍒 ‧₊˚🩰🍃",
        threadID,
        messageID
      );
    }

    try {
      const apiUrl = await baseApiUrl();
      const url = `${apiUrl}/api/toilet?user=${id}`;

      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });

      const filePath = path.join(__dirname, `toilet_${id}.png`);
      fs.writeFileSync(filePath, response.data);

      api.sendMessage(
        {
          body: "Here's your toilet image 🐸",
          attachment: fs.createReadStream(filePath),
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

    } catch (err) {
      api.sendMessage(
        "🍓 𝐒𝐨𝐫𝐫𝐲 𝐛𝐚𝐛𝐲! 𝐒𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐰𝐞𝐧𝐭 𝐰𝐫𝐨𝐧𝐠 💔🍒 ‧₊˚🩰🍃\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫 🥺",
        threadID,
        messageID
      );
    }
  },
};