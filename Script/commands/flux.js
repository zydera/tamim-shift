const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "flux",
  version: "4.0",
  hasPermssion: 0,
  credits: "Mahim",
  description: "Generate highly realistic 4k images with Cloudflare FLUX",
  commandCategory: "image generator",
  usage: ".flux [prompt]",
  countDown: 15
};

module.exports.run = async ({ event, args, api }) => {
  // Cloudflare Credentials
  const ACCOUNT_ID = "39eea946c2c2d4464d6e48ac25a8039a";
  const API_TOKEN = "TxNUt77kyLODkq-c5PbveqJtlxVuOWV9N5sPKJz6"; 
  
  // FLUX-1-Schnell for 4K Photorealism
  const MODEL = "@cf/black-forest-labs/flux-1-schnell";
  const baseURL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`;

  try {
    if (!args.length) {
      return api.sendMessage(
        "Please enter a prompt.\n\nExamples:\n.flux a photorealistic cat\n.flux highly detailed nature landscape",
        event.threadID,
        event.messageID
      );
    }

    const fullInput = args.join(" ").trim();
    let promptText = fullInput;

    // Safely ignore ratio parameters since Cloudflare FLUX only does 1024x1024 squares
    if (fullInput.includes("--")) {
      promptText = fullInput.split("--")[0].trim();
    }

    // Force realism by injecting hidden high-quality photography tags
    const realisticPrompt = promptText + ", highly detailed, photorealistic, extreme realism, 4k resolution, masterpiece";

    // Stylish fancy font loading message with requested emojis
    const waitMessage = await api.sendMessage(
      `𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐑𝐞𝐚𝐥𝐢𝐬𝐭𝐢𝐜 𝟒𝐊 𝐈𝐦𝐚𝐠𝐞... 🍒🍓 ‧₊˚🩰🍃\n\n➭ 𝐏𝐫𝐨𝐦𝐩𝐭: ${promptText}`,
      event.threadID
    );

    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    // Call Cloudflare API (Getting the standard JSON response)
    const submit = await axios.post(
      baseURL,
      {
        prompt: realisticPrompt,
        steps: 8 // Max steps for the highest quality output
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json"
        },
        timeout: 60000 
      }
    );

    // Extract the Base64 image string from Cloudflare's JSON response
    const base64Image = submit.data?.result?.image;
    
    if (!base64Image) {
      throw new Error("No image data returned from Cloudflare.");
    }

    // Convert the Base64 text back into a real, uncorrupted binary image buffer
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Create a temporary file path
    const tempPath = path.join(__dirname, `flux_temp_${Date.now()}.png`);
    
    // Save the actual image to the folder
    fs.writeFileSync(tempPath, imageBuffer);

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    if (waitMessage?.messageID) {
      api.unsendMessage(waitMessage.messageID);
    }

    // Send the file stream to Facebook, then delete the file to save server space
    return api.sendMessage(
      {
        attachment: fs.createReadStream(tempPath)
      },
      event.threadID,
      () => {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      },
      event.messageID
    );

  } catch (e) {
    console.error("Flux API Error:", e?.response?.data || e.message);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    
    return api.sendMessage(
      "❌ 𝐄𝐫𝐫𝐨𝐫: Failed to generate image. Please try a different prompt or wait a moment.",
      event.threadID,
      event.messageID
    );
  }
};