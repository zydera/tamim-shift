const axios = require("axios");
const simsim = "https://mahimcraft.alwaysdata.net/simsim";
const botApi = "https://mahimcraft.alwaysdata.net/simsim/bot/"; // Your custom random text API

// 🚀 OPTIMIZATION: Arrays stay outside for speed.
const triggers = [
  "baby", "bby", "pakhi", "jan", "xan",
  "babu", "bb", "sona", "janu", "jaan",
  "bebu", "babe", "babyy", "botu", "bot",
  "বেবি", "বেবী", "বট", "জান", "জানু",
  "সোনা", "বাবু", "বেবু", "বাবাই", "জানুু"
];

module.exports.config = {
  name: "baby",
  version: "1.0.7",
  hasPermssion: 0,
  credits: "Modified by MAHIM ISLAM",
  description: "Cute AI Baby Chatbot with custom API & smart matching",
  commandCategory: "simsim",
  usages: "[message/query]",
  cooldowns: 0,
  prefix: false
};

// 🛡️ Helper: Fetch random text from your PHP API
async function fetchRandomGreeting() {
  try {
    const response = await axios.get(botApi);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Bot API Error:", error.message);
    return "উফফ! আমার সার্ভার ডাউন হয়ে গেছে 😭";
  }
}

// 🛡️ Helper: Fetch reply from your SimSimi API
async function fetchAndSendSimSimi(api, event, text, senderName) {
  try {
    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`
    );

    if (!res || !res.data || !res.data.response) return; 

    const responses = Array.isArray(res.data.response)
      ? res.data.response
      : [res.data.response];

    for (const reply of responses) {
      if (!reply) continue; 
      
      await new Promise((resolve) => {
        api.sendMessage(reply, event.threadID, () => resolve(), event.messageID);
      });
    }
  } catch (error) {
    console.error("SimSimi API Error:", error.message);
  }
}

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;
    const senderName = await Users.getNameUser(uid);
    const rawQuery = args.join(" ");
    const query = rawQuery.toLowerCase().trim();

    // If command is called with no arguments (e.g., just "/baby")
    if (!query) {
      const randomReply = await fetchRandomGreeting();
      return api.sendMessage(randomReply, event.threadID, event.messageID);
    }

    const command = (args[0] || "").toLowerCase();

    if (["remove", "rm"].includes(command)) {
      const parts = rawQuery.replace(/^(remove|rm)\s*/i, "").split(" - ");
      if (parts.length < 2) return api.sendMessage("🍓 Use: remove [Question] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts.map(p => p.trim());
      const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (command === "list") {
      const res = await axios.get(`${simsim}/list`);
      if (res.data.code === 200) {
        return api.sendMessage(`🍒 Total Questions Learned: ${res.data.totalQuestions}\n🍓 Total Replies Stored: ${res.data.totalReplies}\n🌸 Developer: ${res.data.author}`, event.threadID, event.messageID);
      } else {
        return api.sendMessage(`Error: ${res.data.message || "Failed to fetch list"}`, event.threadID, event.messageID);
      }
    }

    if (command === "edit") {
      const parts = rawQuery.replace(/^edit\s*/i, "").split(" - ");
      if (parts.length < 3) return api.sendMessage("🍓 Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);
      const [ask, oldReply, newReply] = parts.map(p => p.trim());
      const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (command === "teach") {
      const parts = rawQuery.replace(/^teach\s*/i, "").split(" - ");
      if (parts.length < 2) return api.sendMessage("🍓 Use: teach [Question] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts.map(p => p.trim());
      
      const groupID = event.threadID;
      let groupName = event.threadName ? event.threadName.trim() : "";

      if (!groupName && groupID != uid) {
        try {
          const threadInfo = await api.getThreadInfo(groupID);
          if (threadInfo && threadInfo.threadName) groupName = threadInfo.threadName.trim();
        } catch (error) {
          console.error(`Error fetching thread info for ID ${groupID}:`, error);
        }
      }

      let teachUrl = `${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}&groupID=${encodeURIComponent(groupID)}`;
      if (groupName) teachUrl += `&groupName=${encodeURIComponent(groupName)}`;

      const res = await axios.get(teachUrl);
      return api.sendMessage(`${res.data.message || "Reply added successfully!"}`, event.threadID, event.messageID);
    }

    // Normal chat flow via command
    await fetchAndSendSimSimi(api, event, query, senderName);

  } catch (err) {
    console.error(err);
    return api.sendMessage(`🍒 Error in baby command: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, Users }) {};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    if (!event.senderID || !event.body) return;

    const raw = event.body.toLowerCase().trim();
    if (!raw) return;

    const senderName = await Users.getNameUser(event.senderID);
    const senderID = event.senderID;

    // 🎯 THE SMART FALLBACK: Handles ANY reply directly to the bot's messages
    if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID == api.getCurrentUserID()) {
      let isPending = false;
      if (global.client.handleReply && Array.isArray(global.client.handleReply)) {
        isPending = global.client.handleReply.some(item => item.messageID == event.messageReply.messageID);
      }
      
      if (!isPending) {
        await fetchAndSendSimSimi(api, event, raw, senderName);
        return;
      }
    }

    // 1. EXACT MATCH: If the user only said the trigger word (e.g., just "baby" or "bot")
    if (triggers.includes(raw)) {
      const randomReply = await fetchRandomGreeting();
      const mention = {
        body: `${randomReply} @${senderName}`,
        mentions: [{
          tag: `@${senderName}`,
          id: senderID
        }]
      };

      return api.sendMessage(mention, event.threadID, event.messageID);
    }

    // 2. ANYWHERE MATCH: If the trigger word is inside the sentence (start, middle, or end)
    let matchedTrigger = null;
    for (const t of triggers) {
      const regex = new RegExp(`(^|\\s)${t}(\\s|$)`, 'i');
      if (regex.test(raw)) {
        matchedTrigger = t;
        break;
      }
    }

    if (matchedTrigger) {
      const regex = new RegExp(`(^|\\s)${matchedTrigger}(\\s|$)`, 'i');
      const query = raw.replace(regex, ' ').trim();
      
      // ✅ FIX: Check if the query starts with a command (teach, edit, rm, remove, list)
      // If it does, stop handleEvent completely because module.exports.run will handle it!
      const firstWord = (query.split(/\s+/)[0] || "").toLowerCase();
      if (["teach", "edit", "rm", "remove", "list"].includes(firstWord)) {
          return;
      }
      
      if (query) {
        await fetchAndSendSimSimi(api, event, query, senderName);
      }
    }

  } catch (err) {
    console.error("🍃 Error in handleEvent:", err.message);
  }
};
