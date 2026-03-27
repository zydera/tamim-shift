module.exports.config = {
  name: "chor",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Mahim Islam (fixed by ChatGPT)",
  description: "Funny chor meme with avatar",
  commandCategory: "fun",
  usages: "@mention / reply",
  cooldowns: 5,
};

module.exports.run = async ({ event, api }) => {
  try {
    const Canvas = require("canvas");
    const axios = require("axios");
    const fs = require("fs-extra");
    const path = __dirname + "/cache/chor.png";

    // 🔥 USER DETECTION
    let id = event.senderID;
    if (event.type === "message_reply") {
      id = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      id = Object.keys(event.mentions)[0];
    }

    // 🎭 RANDOM CAPTIONS
    const captions = [
      "মুরগির দুধ চুরি করতে গিয়া ধরা খাইছে..! 🐸",
      "চোর ধরা পড়ছে লাইভে 😭",
      "ধরা খাইছে বেটা! এখন কি বলবি? 🤡",
      "এত চুরি করিস কেন রে ভাই 💀",
      "পুলিশ ডাকবো নাকি? 🚓",
      "চুরি করতে গিয়ে ক্যামেরায় ধরা 😭",
      "এবার তো শেষ! 🤣",
      "চোরের ১০ দিন, গৃহস্থের ১ দিন 😏",
      "বাবা রে! হাতে নাতে ধরা 😆",
      "এই মুখটাই চোরের মুখ 🐸👻"
    ];

    const randomCaption =
      captions[Math.floor(Math.random() * captions.length)];

    // 🎨 CANVAS
    const canvas = Canvas.createCanvas(500, 670);
    const ctx = canvas.getContext("2d");

    // 🖼 BACKGROUND
    const background = await Canvas.loadImage(
      "https://i.imgur.com/ES28alv.png"
    );

    // 🧑 AVATAR FETCH (FIXED)
    const avatarURL = `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatar = await axios({
      url: avatarURL,
      responseType: "arraybuffer",
    });

    const avatarImg = await Canvas.loadImage(avatar.data);

    // DRAW BG
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // 🔵 CIRCLE AVATAR
    ctx.save();
    ctx.beginPath();
    ctx.arc(48 + 55.5, 410 + 55.5, 55.5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, 48, 410, 111, 111);
    ctx.restore();

    // 💾 SAVE
    fs.writeFileSync(path, canvas.toBuffer());

    // 📤 SEND
    return api.sendMessage(
      {
        body: `😂 ${randomCaption}`,
        attachment: fs.createReadStream(path),
      },
      event.threadID,
      () => fs.unlinkSync(path),
      event.messageID
    );
  } catch (e) {
    console.log(e);
    return api.sendMessage(
      "❌ Error: " + e.message,
      event.threadID,
      event.messageID
    );
  }
};