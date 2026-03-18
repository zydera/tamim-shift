const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "MAHIM ISLAM",
    description: "Show Owner Info",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    var callback = () => api.sendMessage({
        body: `
┏━━━━━━━━━━━━━━━━━━━━━┓
┃      🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟      
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 𝐍𝐚𝐦𝐞     :  𝐌𝐚𝐡𝐢𝐦 𝐈𝐬𝐥𝐚𝐦
┃ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫   : 𝐌𝐚𝐥𝐞
┃ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧   : 𝐒𝐢𝐧𝐠𝐥𝐞
┃ 🎂 𝐀𝐠𝐞       : 16
┃ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧   : 𝐈𝐬𝐥𝐚𝐦
┃ 🏫 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧  : 𝐒𝐭𝐮𝐝𝐲 𝐚𝐭 𝐜𝐥𝐚𝐬𝐬-10
┃ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬   : 𝐃𝐡𝐚𝐤𝐚, 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🎭 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦  : https://www.instagram.com/mahimcraft
┃ 🌐 𝐖𝐞𝐛𝐬𝐢𝐭𝐞 : https://mahim.xo.je/
┃ 📢 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : https://www.facebook.com/its.mahim.islam
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🕒 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐓𝐢𝐦𝐞:  ${time}
┗━━━━━━━━━━━━━━━━━━━━━┛
        `,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
  
    return request(encodeURI(`https://i.ibb.co/ymqmV7Bz/IMG-20251001-152900.jpg`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
};
