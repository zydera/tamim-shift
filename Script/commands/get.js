module.exports.config = {
    name: "get",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Gemini + ChatGPT",
    description: "Fetch media from direct or short links",
    commandCategory: "media",
    usages: "[url]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const path = require("path");

    const inputUrl = args[0];

    if (!inputUrl || !inputUrl.startsWith("http")) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage(
            "𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝘀𝗮𝗴𝗲.\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: .get https://example.com/file.mp4",
            event.threadID,
            event.messageID
        );
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
        // Decode short links / redirects automatically
        let finalUrl = inputUrl;

        try {
            const redirectCheck = await axios.get(inputUrl, {
                maxRedirects: 5,
                timeout: 15000,
                responseType: "stream"
            });

            finalUrl =
                redirectCheck.request?.res?.responseUrl ||
                redirectCheck.request?.path ||
                inputUrl;

            redirectCheck.data.destroy();
        } catch {}

        // Get headers from final URL
        let mimeType = "";
        let fileSize = 0;

        try {
            const headRes = await axios.head(finalUrl, {
                maxRedirects: 5,
                timeout: 10000
            });

            mimeType = headRes.headers["content-type"] || "";
            fileSize = parseInt(headRes.headers["content-length"]) || 0;
        } catch {}

        // Size limit 25MB
        if (fileSize > 25 * 1024 * 1024) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            return api.sendMessage(
                "𝗙𝗶𝗹𝗲 𝘁𝗼𝗼 𝗹𝗮𝗿𝗴𝗲. Max 25MB allowed.",
                event.threadID,
                event.messageID
            );
        }

        // Detect extension
        let ext = "bin";

        if (mimeType.includes("jpeg")) ext = "jpg";
        else if (mimeType.includes("png")) ext = "png";
        else if (mimeType.includes("gif")) ext = "gif";
        else if (mimeType.includes("webp")) ext = "webp";
        else if (mimeType.includes("mp4")) ext = "mp4";
        else if (mimeType.includes("mpeg")) ext = "mp3";
        else if (mimeType.includes("ogg")) ext = "ogg";
        else if (mimeType.includes("wav")) ext = "wav";
        else if (mimeType.includes("pdf")) ext = "pdf";
        else {
            try {
                let clean = finalUrl.split("?")[0];
                let guess = clean.split(".").pop();
                if (guess && guess.length <= 5) ext = guess;
            } catch {}
        }

        // Cache folder create
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

        const tempPath = path.join(cacheDir, `${Date.now()}.${ext}`);

        // Download content
        const response = await axios({
            method: "GET",
            url: finalUrl,
            responseType: "stream",
            timeout: 30000,
            maxRedirects: 5,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const writer = fs.createWriteStream(tempPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        // Send media
        api.sendMessage(
            {
                body: "",
                attachment: fs.createReadStream(tempPath)
            },
            event.threadID,
            (err) => {
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

                if (err) {
                    api.setMessageReaction("❌", event.messageID, () => {}, true);
                    return api.sendMessage(
                        "𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝘀𝗲𝗻𝗱. Maybe file unsupported or too large.",
                        event.threadID,
                        event.messageID
                    );
                }

                api.setMessageReaction("✅", event.messageID, () => {}, true);
            },
            event.messageID
        );

    } catch (e) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage(
            "𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗳𝗲𝘁𝗰𝗵 𝗰𝗼𝗻𝘁𝗲𝗻𝘁.\nCheck link or site blocked.",
            event.threadID,
            event.messageID
        );
    }
};