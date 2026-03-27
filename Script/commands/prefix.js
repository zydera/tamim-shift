const moment = require("moment-timezone");

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "OpenAI",
  description: "Premium prefix preview",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body || body.trim().toLowerCase() !== "prefix") return;

  const start = Date.now();
  const now = moment.tz("Asia/Dhaka");

  const { PREFIX, BOTNAME } = global.config;
  const threadPrefix =
    global.data?.threadData?.get(threadID)?.PREFIX || PREFIX;

  const msg = `🍓 𝖯𝗋𝖾𝖿𝗂𝗑 𝖯𝖺𝗇𝖾𝗅 ✦

‧₊˚🩰 𝖡𝗈𝗍: ${BOTNAME || "Bot"}
‧₊˚🍒 𝖯𝗋𝖾𝖿𝗂𝗑: ${threadPrefix}
‧₊˚🍃 𝖯𝗂𝗇𝗀: ${Date.now() - start}ms
‧₊˚🍓 𝖳𝗂𝗆𝖾: ${now.format("hh:mm:ss A")}
‧₊˚🍒 𝖣𝖺𝗍𝖾: ${now.format("DD/MM/YYYY")}`;

  api.sendMessage(msg, threadID, messageID);
};

module.exports.run = async () => {};