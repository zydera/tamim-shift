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
    name: "murgi",
    aliases: ["chicken", "মুরগি"],
    version: "2.0",
    author: "MAHIM ISLAM",
    countDown: 10,
    role: 0,
    description: "Create a funny murgi (hen) image of someone",
    category: "fun",
    guide: "{pn} <@tag/reply/UID>: Tag/Reply to make someone murgi"
  },

  onStart: async function ({ api, event, args, message }) {
    const { mentions, messageReply } = event;
    let id;

    if (Object.keys(mentions).length > 0) {
      id = Object.keys(mentions)[0];
    } else if (messageReply) {
      id = messageReply.senderID;
    } else if (args[0] && !isNaN(args[0])) {
      id = args[0];
    }

    if (!id) {
      return message.reply("🍓 Baby, mention, reply, or provide UID of the target! 🐓 ‧₊˚🩰🍃");
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const filePath = path.join(cacheDir, `murgi_${id}.png`);

    try {
      api.setMessageReaction("🐓", event.messageID, () => {}, true);

      const baseUrl = await baseApiUrl();
      const url = `${baseUrl}/api/murgi?user=${id}`;

      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data));

      return message.reply(
        {
          body: "Here's your murgi image 🐸",
          attachment: fs.createReadStream(filePath)
        },
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      );

    } catch (err) {
      console.error("Murgi Error:", err);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return message.reply(`🍒 API error: ${err.message} ‧₊˚🩰🍃`);
    }
  }
};