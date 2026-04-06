const axios = require("axios");

const toBoldSerif = (str) => {
  const map = {'0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗','a':'𝐚','b':'𝐛','c':'𝐜','d':'𝐝','e':'𝐞','f':'𝐟','g':'𝐠','h':'𝐡','i':'𝐢','j':'𝐣','k':'𝐤','l':'𝐥','m':'𝐦','n':'𝐧','o':'𝐨','p':'𝐩','q':'𝐪','r':'𝐫','s':'𝐬','t':'𝐭','u':'𝐮','v':'𝐯','w':'𝐰','x':'𝐱','y':'𝐲','z':'𝐳','A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉','K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓','U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙'};
  return String(str).replace(/[a-zA-Z0-9]/g, m => map[m] || m);
};

module.exports.config = {
  name: "daily",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "MAHIM ISLAM",
  description: "Claim daily money (Resets at midnight)",
  commandCategory: "economy",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    let name = await Users.getNameUser(event.senderID) || "User";
    const encodedName = encodeURIComponent(name);

    const apiUrl = `https://mahimcraft.alwaysdata.net/economy/?type=daily&uid=${event.senderID}&name=${encodedName}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status === "success") {
      // Replaces the api emoji with standard $
      const cleanAmt = data.amount_formatted.replace(/💲/g, '$');
      const boldMsg = toBoldSerif(`Got ${cleanAmt} (Streak: ${data.streak})`);
      return api.sendMessage(`🎁 | ${boldMsg}`, event.threadID, event.messageID);
    } 
    else if (data.error_type === "cooldown") {
      // Using the raw countdown integers from v2 API
      const boldWait = toBoldSerif(`Already claimed today! Wait ${data.countdown_hours}h ${data.countdown_minutes}m for next day.`);
      return api.sendMessage(`⏳ | ${boldWait}`, event.threadID, event.messageID);
    } 
    else {
      return api.sendMessage(`⚠️ | ${toBoldSerif(data.message || "Error")}`, event.threadID, event.messageID);
    }
  } catch (error) {
    return api.sendMessage("❌ | 𝐄𝐫𝐫𝐨𝐫", event.threadID, event.messageID);
  }
};
