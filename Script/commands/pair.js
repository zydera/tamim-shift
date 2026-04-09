module.exports.config = {  
  name: "pair",  
  aliases: ["pr"],  
  version: "4.1.0",  
  hasPermssion: 0,  
  credits: "MAHIM ISLAM",  
  description: "Premium random pairing with custom canvas API",  
  commandCategory: "fun",  
  usages: "",  
  cooldowns: 3  
};  
  
// ✅ Smart gender normalize  
function normalizeGender(gender) {  
  if (gender === 2 || gender === "2" || gender === "MALE" || gender === "male") return "MALE";  
  if (gender === 1 || gender === "1" || gender === "FEMALE" || gender === "female") return "FEMALE";  
  return null;  
}  
  
module.exports.run = async function ({ api, event }) {  
  try {  
    const axios = global.nodemodule["axios"];  
    const fs = global.nodemodule["fs-extra"];  
    const path = global.nodemodule["path"];  
  
    const cacheDir = __dirname + "/cache";  
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });  
  
    // 💙 Instant reaction (loading state)  
    api.setMessageReaction("💙", event.messageID, () => {}, true);  
  
    const threadInfo = await api.getThreadInfo(event.threadID);  
    let members = threadInfo.userInfo || [];  
    const botID = api.getCurrentUserID();  
  
    // ✅ Get sender info  
    const senderUser = members.find(u => String(u.id) === String(event.senderID));  
    if (!senderUser) {  
      return api.sendMessage("🍒 Could not detect your profile.", event.threadID, event.messageID);  
    }  
  
    let senderGender = normalizeGender(senderUser.gender);  
  
    // ❗ Fallback detection using name  
    if (!senderGender) {  
      const name = (senderUser.name || "").toLowerCase();  
      if (name.match(/a$|i$|y$|ah$|ia$/)) senderGender = "FEMALE";  
      else senderGender = "MALE";   
    }  
  
    // ✅ Strict opposite gender filter  
    let candidates = members.filter(u => {  
      if (  
        String(u.id) === String(botID) ||  
        String(u.id) === String(event.senderID)  
      ) return false;  
  
      let g = normalizeGender(u.gender);  
  
      if (!g) {  
        const name = (u.name || "").toLowerCase();  
        if (name.match(/a$|i$|y$|ah$|ia$/)) g = "FEMALE";  
        else g = "MALE";  
      }  
  
      return g !== senderGender;  
    });  
  
    if (!candidates.length) {  
      return api.sendMessage("🍓 No opposite gender members found in this group.", event.threadID, event.messageID);  
    }  
  
    // Pick random target  
    const targetUser = candidates[Math.floor(Math.random() * candidates.length)];  
    const targetID = targetUser.id;  
  
    // Get names  
    const senderInfo = await api.getUserInfo(event.senderID);  
    const targetInfo = await api.getUserInfo(targetID);  
    const senderName = senderInfo?.[event.senderID]?.name || "User";  
    const targetName = targetInfo?.[targetID]?.name || "Crush";  
  
    // 🌐 Call Custom Canvas API  
    const apiUrl = `https://mahiiim.alwaysdata.net/pair/?id_1=${event.senderID}&id_2=${targetID}`;  
    const apiResponse = await axios.get(apiUrl);  
    const pairData = apiResponse.data;  
  
    if (!pairData || !pairData.success) {  
      return api.sendMessage("⚠️ Failed to generate pair image from API.", event.threadID, event.messageID);  
    }  
  
    const percent = pairData.raw_percentage;  
    const imageUrl = pairData.result.link;  
  
    // 🎭 Dynamic Vibe  
    let vibeEmoji = "🌌";  
    let vibeText = "Night Vibes";  
  
    if (percent < 50) {  
      vibeEmoji = "🧊";  
      vibeText = "Awkward";  
    } else if (percent < 60) {  
      vibeEmoji = "🌱";  
      vibeText = "Casual";  
    } else if (percent < 70) {  
      vibeEmoji = "🍓";  
      vibeText = "Cute";  
    } else if (percent < 80) {  
      vibeEmoji = "🍯";  
      vibeText = "Sweet";  
    } else if (percent < 90) {  
      vibeEmoji = "⚡";  
      vibeText = "Electric";  
    }  
  
    // Download generated image  
    const imagePath = path.join(cacheDir, `pair_canvas_${event.senderID}.png`);  
    const imageBuffer = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;  
    fs.writeFileSync(imagePath, Buffer.from(imageBuffer));  
  
    // Stylish Body  
    const msgBody =   
      `✦ 𝗠𝗔𝗧𝗖𝗛 𝗥𝗘𝗦𝗨𝗟𝗧\n` +  
      `${senderName} × ${targetName}\n` +  
      `───────────────\n` +  
      `🔥 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗼𝗻: ${percent}%\n` +  
      `${vibeEmoji} 𝗧𝘆𝗽𝗲: ${vibeText}`;  
  
    const msg = {  
      body: msgBody,  
      attachment: fs.createReadStream(imagePath)  
    };  
  
    // 🩷 Success reaction  
    api.setMessageReaction("🩷", event.messageID, () => {}, true);  
  
    return api.sendMessage(msg, event.threadID, () => {  
      try { if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); } catch (e) {}  
    }, event.messageID);  
  
  } catch (err) {  
    console.log("pair error:", err);  
  
    // ❌ Optional fail reaction  
    api.setMessageReaction("💔", event.messageID, () => {}, true);  
  
    return api.sendMessage(  
      "🍓 Error: " + err.message,  
      event.threadID,  
      event.messageID  
    );  
  }  
};