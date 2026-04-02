module.exports.config = {
  name: "pair",
  aliases: ["pr"],
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Modified by ChatGPT - Smart Gender Matching",
  description: "Premium random pairing with strict opposite gender",
  commandCategory: "fun",
  usages: "",
  cooldowns: 3
};

// ✅ Smart gender normalize (improved)
function normalizeGender(gender) {
  if (gender === 2 || gender === "2" || gender === "MALE" || gender === "male") return "MALE";
  if (gender === 1 || gender === "1" || gender === "FEMALE" || gender === "female") return "FEMALE";
  return null;
}

module.exports.run = async function ({ api, event }) {
  try {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];

    const cacheDir = __dirname + "/cache";
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const threadInfo = await api.getThreadInfo(event.threadID);
    let members = threadInfo.userInfo || [];

    const botID = api.getCurrentUserID();

    // ✅ Get sender info
    const senderUser = members.find(u => String(u.id) === String(event.senderID));
    if (!senderUser) {
      return api.sendMessage(
        "🍒 Could not detect your profile.",
        event.threadID,
        event.messageID
      );
    }

    let senderGender = normalizeGender(senderUser.gender);

    // ❗ Latest trick: fallback detection using name (if gender missing)
    if (!senderGender) {
      const name = (senderUser.name || "").toLowerCase();
      if (name.match(/a$|i$|y$|ah$|ia$/)) senderGender = "FEMALE";
      else senderGender = "MALE"; // fallback default
    }

    // ✅ Strict opposite gender filter
    let candidates = members.filter(u => {
      if (
        String(u.id) === String(botID) ||
        String(u.id) === String(event.senderID)
      ) return false;

      let g = normalizeGender(u.gender);

      // fallback detection
      if (!g) {
        const name = (u.name || "").toLowerCase();
        if (name.match(/a$|i$|y$|ah$|ia$/)) g = "FEMALE";
        else g = "MALE";
      }

      return g !== senderGender;
    });

    if (!candidates.length) {
      return api.sendMessage(
        "🍓 No opposite gender members found in this group.",
        event.threadID,
        event.messageID
      );
    }

    const targetUser = candidates[Math.floor(Math.random() * candidates.length)];
    const targetID = targetUser.id;

    const senderInfo = await api.getUserInfo(event.senderID);
    const targetInfo = await api.getUserInfo(targetID);

    const senderName =
      senderInfo?.[event.senderID]?.name || "User";

    const targetName =
      targetInfo?.[targetID]?.name || "Crush";

    const percent = Math.floor(Math.random() * 100) + 1;

    let vibe = "Sweet vibe";
    if (percent <= 10) vibe = "Just a tiny spark";
    else if (percent <= 20) vibe = "Shy connection";
    else if (percent <= 35) vibe = "Funny match";
    else if (percent <= 50) vibe = "Cute energy";
    else if (percent <= 65) vibe = "Nice chemistry";
    else if (percent <= 80) vibe = "Lovely pair";
    else if (percent <= 95) vibe = "Almost perfect";
    else vibe = "Perfect match";

    const file1 = `${cacheDir}/pair_${event.senderID}.png`;
    const file2 = `${cacheDir}/pair_${targetID}.png`;

    const avatar1 = (
      await axios.get(
        `https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;

    const avatar2 = (
      await axios.get(
        `https://graph.facebook.com/${targetID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;

    fs.writeFileSync(file1, Buffer.from(avatar1));
    fs.writeFileSync(file2, Buffer.from(avatar2));

    const msg = {
      body:
        "🍒 PAIR RESULT 🍒\n\n" +
        `${senderName} × ${targetName}\n\n` +
        `Match: ${percent}%\n` +
        `Vibe: ${vibe}\n` +
        `Type: Opposite Gender Match`,
      attachment: [
        fs.createReadStream(file1),
        fs.createReadStream(file2)
      ]
    };

    return api.sendMessage(msg, event.threadID, () => {
      try { if (fs.existsSync(file1)) fs.unlinkSync(file1); } catch {}
      try { if (fs.existsSync(file2)) fs.unlinkSync(file2); } catch {}
    }, event.messageID);

  } catch (err) {
    console.log("pair error:", err);
    return api.sendMessage(
      "🍓 Error: " + err.message,
      event.threadID,
      event.messageID
    );
  }
};
