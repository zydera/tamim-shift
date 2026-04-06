const axios = require("axios");

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
      return message.reply(
        "🍓 Baby, mention, reply, or provide UID of the target! 🐓 ‧₊˚🩰🍃"
      );
    }

    try {
      // React with chicken emoji while processing
      api.setMessageReaction("🐓", event.messageID, () => {}, true);

      // Get API base URL
      const baseUrl = await baseApiUrl();
      const url = `${baseUrl}/api/murgi?user=${id}`;

      // Fetch image
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(response.data);

      // Send image directly without saving
      return message.reply({
        body: "Here's your murgi image 🐸",
        attachment: imageBuffer
      });

    } catch (err) {
      console.error("Murgi Error:", err.response?.data || err.message);
      return message.reply(`🍒 API error: ${err.message} ‧₊˚🩰🍃`);
    }
  }
};