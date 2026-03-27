module.exports.config = {
  name: "poke",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mahim Islam",
  description: "Poke your friend with funny style 😆",
  commandCategory: "fun",
  usages: "poke @user / reply / auto",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = __dirname + "/cache/poke.gif";

  const { threadID, messageID, senderID, messageReply, mentions } = event;

  let target;
  let tagName = "";

  // 🔹 PRIORITY TARGET DETECTION
  if (messageReply) {
    target = messageReply.senderID;
    tagName = "this unlucky soul 😏";
  } else if (Object.keys(mentions).length > 0) {
    target = Object.keys(mentions)[0];
    tagName = mentions[target].replace("@", "");
  } else {
    // 🔹 RANDOM USER IN THREAD
    const threadInfo = await api.getThreadInfo(threadID);
    const users = threadInfo.participantIDs.filter(id => id != senderID);
    if (users.length === 0) {
      return api.sendMessage("⚠️ No one to poke 😢", threadID, messageID);
    }
    target = users[Math.floor(Math.random() * users.length)];
    tagName = "a random victim 😈";
  }

  try {
    // 🔹 GET POKE GIF (anime/funny style)
    const res = await axios.get("https://api.waifu.pics/sfw/poke");
    const gifURL = res.data.url;

    // 🔹 DOWNLOAD GIF TO CACHE
    const buffer = (await axios.get(gifURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, buffer);

    // 🔹 FUNNY STYLISH MESSAGE
    const msg = {
      body: `💥 𝐏𝐎𝐊𝐄𝐃! 𝐁𝐚𝐦! ${tagName} got shocked ⚡😂\n\n*Hope it didn't hurt 😜*`,
      attachment: fs.createReadStream(path),
      mentions: target ? [{ tag: tagName, id: target }] : []
    };

    api.sendMessage(msg, threadID, () => {
      fs.unlinkSync(path); // clean cache
      api.setMessageReaction("😂", messageID, () => {}, true);
    }, messageID);

  } catch (e) {
    console.error(e);
    api.setMessageReaction("☹️", messageID, () => {}, true);
    api.sendMessage("❌ Failed to poke 😭", threadID, messageID);
  }
};