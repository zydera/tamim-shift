const axios = require('axios');

module.exports.config = {
  name: "Obot",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "goibot with external API and fixed prefix ignorers",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, Users }) {
  if (!event.body) return;

  const { threadID, messageID } = event;
  const text = event.body.toLowerCase().trim();

  // 🛑 IGNORER BLOCK: Prevents exact match intercepts on prefixed commands
  const prefix = (global.config && global.config.PREFIX) ? global.config.PREFIX : ".";
  const commonPrefixes = [prefix, "/", "!", "#", "?"]; 
  if (commonPrefixes.some(p => text.startsWith(p))) {
      return; 
  }

  // 🚀 OPTIMIZATION: Super fast array matching for specific keywords
  if (["miss", "miss you"].includes(text)) {
    return api.sendMessage("<আমি তোমাকে রাইতে মিস খাই🥹🤖👅/👅-✘  🎀 🍒:))", threadID);
  }
  
  if (["😘", "😽"].includes(text)) {
    return api.sendMessage("কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬", threadID);
  }
  
  if (["help"].includes(text)) { // Because of our new ignorer block above, `.help` won't trigger this!
    return api.sendMessage("Type .help to see all available commands!", threadID);
  }
  
  if (["sim", "simsimi"].includes(text)) {
    return api.sendMessage("simsimi কমান্ড এড় নাই টাইপ করুন baby", threadID);
  }
  
  if (["ওই কিরে", "oi kire", "..."].includes(text)) {
    return api.sendMessage("মধু মধু রসমালাই 🍆⛏️🐸🤣", threadID);
  }
  
  if (["bc", "mc"].includes(text)) {
    return api.sendMessage("SAME TO YOU😊 ", threadID);
  }
  
  if (["🫦", "💋"].includes(text)) {
    return api.sendMessage("কিরে হালা লুচ্চা, এগুলো কি ইমুজি দেস ।", threadID);
  }
  
  if (["morning", "good morning", "shuvo sokal"].includes(text)) {
    return api.sendMessage("GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚", threadID);
  }
  
  if (["tor bal", "bal"].includes(text)) {
    return api.sendMessage("~ বাল উঠে নাই নাকি তোমার?? 🤖", threadID);
  }
  
  if (["owner", "ceo"].includes(text)) {
    return api.sendMessage("‎[𝐎𝐖𝐍𝐄𝐑:☞ Mahim ッ ☜\n𝚈𝚘𝚞 𝙲𝚊𝚗 𝙲𝚊𝚕𝚕 𝙷𝚒𝚖 Mahim.\nতার ওয়েবসাইট ভিজিট করতে পারো: mahim.xo.je 🌐", threadID);
  }
  
  if (["tor boss ke", "admin ke"].includes(text)) {
    return api.sendMessage("My Creator: MAHIM ❤️ হাই আমি মেছেন্জার ROBOT আমার বস মাহিম আমাকে বানিয়েছেন আপনাদের কে হাসানোর জন্য আমি চাই আপনারা সব সময় হাসি খুশি থাকেন", threadID);
  }
  
  if (["admin", "boter admin"].includes(text)) {
    return api.sendMessage("He is Mahim ッ❤️ তাকে সবাই মাহিম নামে চিনে🤙", threadID);
  }
  
  if (["ai"].includes(text)) {
    return api.sendMessage("𖦹 𝗖𝘂𝗿𝗿𝗲𝗻𝘁𝗹𝘆 .𝗮𝗶 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗻𝗼𝘁 𝗮𝗰𝘁𝗶𝘃𝗲! 😊", threadID);
  }
  
  if (["chup", "stop", "চুপ কর", "chup kor", "chup koro", "tham"].includes(text)) {
    return api.sendMessage("তুই চুপ কর পাগল ছাগল! 🌚", threadID);
  }
  
  if (["আসসালামু আলাইকুম", "assalamualaikum", "assalamu alaikum", "salam"].includes(text)) {
    return api.sendMessage("️- ওয়ালাইকুমুস-সালাম-!!🖤", threadID);
  }
  
  if (["sla ami tor boss", "sla ami mahim", "chup sla ami mahim", "madari"].includes(text)) {
    return api.sendMessage("সরি বস মাফ করে দেন আর এমন ভুল হবে গঠন🥺🙏", threadID);
  }
  
  if (["oii", "kire"].includes(text)) {
    return api.sendMessage("কি...? 😒", threadID);
  }
  
  if (["kiss me"].includes(text)) {
    return api.sendMessage("️ তুমি পঁচা তোমাকে কিস দিবো না..! 🤭", threadID);
  }
  
  if (["tnx", "ধন্যবাদ", "thank you", "thanks"].includes(text)) {
    return api.sendMessage("️এতো ধন্যবাদ না দিয়ে পারলে গার্লফ্রেন্ড টা দিয়ে দে..!🌚⛏️🌶️", threadID);
  }
  
  if (["....", "😠", "🤬", "😾", "😡"].includes(text)) {
    return api.sendMessage("️রাগ করে না সোনা পাখি এতো রাগ শরীরের জন্য ভালো না🥰", threadID);
  }
  
  if (["হুম", "hum", "humm", "hm", "hmm"].includes(text)) {
    return api.sendMessage("️হুম চো₹!ইস না মাথা এমনিতেই গরম আছে🤬⛏️😷", threadID);
  }
  
  if (["name", "bot ache", "tor name ki"].includes(text)) {
    return api.sendMessage("️MY NAME IS °_>𝗠𝗔𝗛𝗜𝗠 𝗕𝗕𝗭!", threadID);
  }
  
  if (["bot er baccha", "baccha"].includes(text)) {
    return api.sendMessage("️আমার বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️🌶️ ", threadID);
  }
  
  if (["pic de", "ss deu", "ss de", "react de", "react deu"].includes(text)) {
    return api.sendMessage("️এন থেকে সর দুরে গিয়া মর!😒", threadID);
  }
  
  if (["leader"].includes(text)) {
    return api.sendMessage("️Kiss Randi Ka Name Le Ke Mood Khrab Kr Diya.🙄 Dubara Naam Mat Lena Iska", threadID);
  }
  
  if (["chudi", "tor nanire xudi", "cdi", "tor nani re", "cudi"].includes(text)) {
    return api.sendMessage("️এত চো₹! চু¡₹ করস কেনো দেখা যাবে বাসর-রাতে-তুই-কতো পারিস..!🥱🌝🌚⛏️🌶️ ", threadID);
  }
  
  if (["😅", "😞", "😥", "😭", "😓"].includes(text)) {
    return api.sendMessage("️কি গো কলিজা তোমার কি মন খারাপ? 🥺", threadID);
  }
  
  if (["😒", "🙄"].includes(text)) {
    return api.sendMessage("️ এইদিকে ওইদিকে কি দেখো জানু আমি তোমার সামনে দেখো! 😘", threadID);
  }
  
  if (["amake kew valobashe na", "aj kew nai bole"].includes(text)) {
    return api.sendMessage("️চিন্তা করো কেন আমি তো আছি🫶\nতোমাকে রাইতে ভালোবাসবো! 🌚", threadID);
  }
  
  if (["gf", "bf", "ex"].includes(text)) {
    return api.sendMessage("খালি কি তোরাই পেম করবি আমাকেও একটা গফ দে<🥺", threadID);
  }
  
  if (["😂", "😁", "😆", "🤣", "😸", "😹", "😃", "😄"].includes(text)) {
    return api.sendMessage("ভাই তুই এত হাসিস এত হাসলে তোরে চোরের মতো লাগে..!🌚🤣", threadID);
  }
  
  if (["🥰", "😍", "😻", "❤️", "😘"].includes(text)) {
    return api.sendMessage("ভালোবাসা নামক আবলামী করতে চাইলে ইনবক্সে চলে যা পাগল ছাগল!🌚🐸🌶️🍆", threadID);
  }
  
  if (["কেমন আছো", "কেমন আছেন", "kemon acho", "how are you", "how are you?"].includes(text)) {
    return api.sendMessage("আমি তখনই ভালো থাকি যখন আপনাকে হাসতে দেখি!🤎☺️", threadID);
  }
  
  if (["mon kharap", "tmr ki mon kharap"].includes(text)) {
    return api.sendMessage("আমার সাদা মনে কোনো কাদা নাই...!🌝", threadID);
  }
  
  if (["i love you", "love you", "ভালোবাসি"].includes(text)) {
    return api.sendMessage("সব মুতার জায়গায় গুঁতা দেওয়ার ধান্দা 😪🥱", threadID);
  }
  
  if (["by", "bye", "jaiga", "বাই", "pore kotha hobe", "যাই গা", "gelam"].includes(text)) {
    return api.sendMessage("কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি..!🌚🌶️🍆⛏️", threadID);
  }
  
  if (["tumi khaiso", "khaicho", "khaiso bby"].includes(text)) {
    return api.sendMessage("না ঝাং 🥹 তুমি রান্না করে রাখো আমি এসে খাবো <😘", threadID);
  }
  
  if (["tumi ki amake bhalobasho", "tmi ki amake vlo basho"].includes(text)) {
    return api.sendMessage("হুম ঝাং আমি তোমাকে রাইতে ভলোপাসি <🥵", threadID);
  }
  
  if (["ami mahim"].includes(text)) {
    return api.sendMessage("হ্যা বস কেমন আছেন..?☺️", threadID);
  }
  
  if (["ki koro", "ki kortecho"].includes(text)) {
    return api.sendMessage("তোমার মেসেজের রিপ্লাই দেওয়ার জন্য বসে আছি জানু 😘", threadID);
  }
  
  if (["ki obostha", "obostha ki"].includes(text)) {
    return api.sendMessage("অবস্থা তো খুবই টাইট, গার্লফ্রেন্ড নাই তো তাই! 😭", threadID);
  }

  if (["vai", "bhai", "vaiya", "bhaia"].includes(text)) {
    return api.sendMessage("ভাই ডাকবি না, আমি তোর ক্রাশ! 🙈", threadID);
  }
  
  if (["kutta", "chagol", "pagol", "nodi", "magi", "abal", "bc", "mc", "shawya", "putki", "voda", "vuda", "khanki", "bessha"].includes(text)) {
    return api.sendMessage("গাল্লি দিস ক্যান আবাল 🐸 তোর মুখে গন্ধ, দুরে গিয়া মর! 😾", threadID);
  }
  
  if (["ok", "thik ache", "accha"].includes(text)) {
    return api.sendMessage("এন থেকে সর, দূরে গিয়ে মর! 🤨", threadID);
  }
  
  if (["good night", "gd n8", "ghumate jabo"].includes(text)) {
    return api.sendMessage("গুড নাইট জানু, স্বপ্নে কিন্তু আমারেই দেখবা! 😴❤️", threadID);
  }
  
  if (["sad", "kosto", "kanna"].includes(text)) {
    return api.sendMessage("কান্দিস না ভাই, সব ঠিক হয়ে যাবে 🥹 আমি তো আছি তোর পাশে! ❤️", threadID);
  }
  
  if (["love you too", "love u too"].includes(text)) {
    return api.sendMessage("লজ্জা পাইছি তো 🙈 আসো বুকে আসো ❤️", threadID);
  }

  if (text === "bot") {
    let name = "Babu"; 
    try {
      name = await Users.getNameUser(event.senderID);
      
      const apiUrl = "https://mahimcraft.alwaysdata.net/simsim/bot/"; 
      const response = await axios.get(apiUrl);
      
      const rand = response.data.data || response.data; 
      
      const msg = {
        body: `${rand} @${name}`,
        mentions: [
          {
            tag: `@${name}`,
            id: event.senderID
          }
        ]
      };
      return api.sendMessage(msg, threadID, messageID);
      
    } catch (error) {
      console.error("API Fetch Error:", error);
      const fallbackMsg = {
        body: `উফফ! আমার সার্ভার ডাউন হয়ে গেছে @${name} 😭`,
        mentions: [{ tag: `@${name}`, id: event.senderID }]
      };
      return api.sendMessage(fallbackMsg, threadID, messageID);
    }
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
