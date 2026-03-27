const axios = require("axios");

module.exports.config = {
  name: "flux",
  version: "3.0",
  hasPermssion: 0,
  credits: "Mahim",
  description: "Generate 1:1 FLUX image",
  commandCategory: "image generator",
  usage: ".flux [prompt]\n.flux [prompt] --ratio 1:1",
  countDown: 15
};

module.exports.run = async ({ event, args, api }) => {
  const baseURL = "https://queue.fal.run/fal-ai/flux/schnell";
  const apiKey = "4e85d555-e40b-4756-8a53-1c8f06fab60e:82d65618dec93032cb5ab620961a72a7";

  try {
    if (!args.length) {
      return api.sendMessage(
        "Please enter a prompt.\nExample: .flux anime boy in neon city",
        event.threadID,
        event.messageID
      );
    }

    const fullInput = args.join(" ").trim();

    const [prompt, ratioRaw = "1:1"] = fullInput.includes("--ratio")
      ? fullInput.split("--ratio").map((s) => s.trim())
      : [fullInput, "1:1"];

    if (!prompt) {
      return api.sendMessage(
        "Prompt is missing.\nExample: .flux cat astronaut --ratio 1:1",
        event.threadID,
        event.messageID
      );
    }

    let image_size = "square";
    const ratio = ratioRaw.toLowerCase();

    if (ratio === "1:1" || ratio === "square" || ratio === "1024x1024") {
      image_size = "square";
    } else if (ratio === "16:9" || ratio === "landscape") {
      image_size = "landscape_16_9";
    } else if (ratio === "9:16" || ratio === "portrait") {
      image_size = "portrait_16_9";
    } else if (ratio === "4:3") {
      image_size = "landscape_4_3";
    } else if (ratio === "3:4") {
      image_size = "portrait_4_3";
    }

    const startTime = Date.now();

    const waitMessage = await api.sendMessage(
      "Generating image, please wait...",
      event.threadID
    );

    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    const submit = await axios.post(
      baseURL,
      {
        prompt,
        image_size,
        num_images: 1,
        num_inference_steps: 4,
        enable_safety_checker: true
      },
      {
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "MiraiBot-Flux/3.0"
        },
        timeout: 30000
      }
    );

    const statusUrl = submit.data?.status_url;
    const responseUrl = submit.data?.response_url;

    if (!statusUrl || !responseUrl) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      if (waitMessage?.messageID) api.unsendMessage(waitMessage.messageID);
      return api.sendMessage(
        "Failed to start image generation.",
        event.threadID,
        event.messageID
      );
    }

    let result = null;

    for (let i = 0; i < 30; i++) {
      const check = await axios.get(statusUrl, {
        headers: {
          Authorization: `Key ${apiKey}`,
          "User-Agent": "MiraiBot-Flux/3.0"
        },
        timeout: 20000
      });

      if (check.data?.status === "COMPLETED") {
        const out = await axios.get(responseUrl, {
          headers: {
            Authorization: `Key ${apiKey}`,
            "User-Agent": "MiraiBot-Flux/3.0"
          },
          timeout: 20000
        });
        result = out.data;
        break;
      }

      if (check.data?.status === "FAILED") {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        if (waitMessage?.messageID) api.unsendMessage(waitMessage.messageID);
        return api.sendMessage(
          "Image generation failed.",
          event.threadID,
          event.messageID
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const imageUrl = result?.images?.[0]?.url;

    if (!imageUrl) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      if (waitMessage?.messageID) api.unsendMessage(waitMessage.messageID);
      return api.sendMessage(
        "No image was returned.",
        event.threadID,
        event.messageID
      );
    }

    const imageResponse = await axios.get(imageUrl, {
      responseType: "stream",
      headers: {
        "User-Agent": "MiraiBot-Flux/3.0"
      },
      timeout: 30000
    });

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    if (waitMessage?.messageID) {
      api.unsendMessage(waitMessage.messageID);
    }

    return api.sendMessage(
      {
        body: "",
        attachment: imageResponse.data
      },
      event.threadID,
      event.messageID
    );
  } catch (e) {
    console.error(e?.response?.data || e.message || e);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    return api.sendMessage(
      "Error: " + (e?.response?.data?.detail || e.message),
      event.threadID,
      event.messageID
    );
  }
};