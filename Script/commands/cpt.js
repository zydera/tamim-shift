module.exports.config = {
    name: "\n", 
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Mahim",
    description: "Sends a stylish listening confirmation with fancy date and time",
    commandCategory: "system",
    usages: ".",
    cooldowns: 5, 
    dependencies: {} // Cleared out dependencies since we aren't downloading images anymore
};

module.exports.run = async ({ api, event }) => {
    // 1. Get the current time in the Bangladesh timezone
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dhaka',
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false // Set to false to get 24-hour format
    });

    // This formats the raw date to "DD/MM/YYYY, HH:MM:SS"
    const rawFormat = formatter.format(now); 
    
    // Convert the slashes to dashes and remove the comma: "DD-MM-YYYY HH:MM:SS"
    const standardTimeStr = rawFormat.replace(/\//g, '-').replace(', ', ' ');

    // 2. Dictionary to map standard numbers to fancy bold unicode numbers
    const boldNumbers = {
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
        '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };

    // Replace every normal number in the string with its bold counterpart
    const fancyTime = standardTimeStr.replace(/[0-9]/g, char => boldNumbers[char]);

    // 3. Assemble the final stylish message
    const replyText = `🍒🍓 ‧₊˚🩰🍃\n\n𝐌𝐚𝐡𝐢𝐦 𝐛𝐨𝐭 𝐥𝐢𝐬𝐭𝐞𝐧𝐢𝐧𝐠... :)\n\n⏰ 𝐓𝐢𝐦𝐞: ${fancyTime}\n\n🍒🍓 ‧₊˚🩰🍃`;

    // 4. Send the message instantly
    api.sendMessage(replyText, event.threadID);
};